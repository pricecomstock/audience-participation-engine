var Room = require("./room");
const crypto = require("crypto");

// TODO: implement namespace "garbage collection"

function generatePlayerId(characters) {
  // Synchronous
  // 3 bytes = 4 base 64 characters
  const num_bytes = Math.floor(characters * 0.75)
  const buf = crypto.randomBytes(num_bytes);
  return buf
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
};

function generateRoomCode() {
  const codeLength = 4;
  // const validCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  // Letters removed to censor bad words
  const validCharacters = "ABCDEFHJLMNOPQRSTVWXYZ";

  let code = "";
  for (let i = 0; i < codeLength; i++) {
    // maybe replace with not pseudo-random
    code += validCharacters[Math.floor(Math.random() * validCharacters.length)];
  }

  return code;
}

class RoomManager {
  constructor(io) {
    this._rooms = [];

    this._io = io.on("connection", socket => {
      // io is the server
      // socket is the client connection
      
      let sendRoomUpdates = (roomCode) => {
        let roomToUpdate = this.getRoomWithCode(roomCode)
        io.in(roomCode).emit("state", roomToUpdate.summary())
      }

      // Startup tasks
      // console.log(code, "a user connected");

      // When client joins a room
      socket.on("room", roomCode => {
        console.log()
        // client will use this to join a room
        if (this.checkRoomExists(roomCode)) {
          socket.join(roomCode);
          socket.roomCode = roomCode;


          // TODO This player creation section should probably be a standalone class when I nail it down
          socket.player = {}
          
          socket.player.nickname = "human";
          socket.player.emoji = "😀";
          socket.player.playerId = generatePlayerId(12);
          socket.player.choiceIndex = -1;

          socket.emit("playerIdAssigned", socket.player.playerId);
          
          console.log(io.sockets.adapter.rooms[roomCode]);
          
          this.getRoomWithCode(roomCode).addPlayer(socket.player);
          sendRoomUpdates(roomCode);
        }
        // TODO Probably need to do something different on joining a room than normal updates, we'll see
        // io.in(this.code).emit("startVote", this.choices);
        // io.in(this.code).emit("results", this.summary());
      });

      socket.on("updateplayerinfo", info => {
        if (this.checkRoomExists(socket.roomCode)) {
          socket.player.nickname = info.nickname;
          socket.player.emoji = info.emoji;
          sendRoomUpdates(socket.roomCode);
        }
      });

      socket.on("vote", choiceIndex => {
        if (this.checkRoomExists(socket.roomCode)) {
          let playerRoom = this.getRoomWithCode(socket.roomCode)
          playerRoom.addPlayerVote(socket.player.playerId, choiceIndex);
          sendRoomUpdates(socket.roomCode)
        }
        // TODO: Else send disconnect notice or something
      });
    });
  }

  get rooms() {
    return this._rooms;
  }

  createNewRoom(roomData) {
    let newRoom = new Room(this.randomAvailableRoomCode(), roomData);
    this._rooms.push(newRoom);
    console.log(this._rooms)
    const adminKey = generatePlayerId(30);
    return {
      roomCode: newRoom.code,
      adminKey: adminKey
    };
  }

  randomAvailableRoomCode() {
    let potentialCode = "";

    // Keep generating codes until one is not taken
    do {
      potentialCode = generateRoomCode();
    } while (this.checkRoomExists(potentialCode));

    return potentialCode;
  }

  checkRoomExists(code) {
    return (
      this._rooms
        // Create array of room codes
        .map(room => {
          return room.code;
        })
        // true if this array has our code in it
        .includes(code)
    );
  }

  getRoomWithCode(code) {
    return this._rooms.find( room => {
      return room.code === code;
    });
  }
}

module.exports = RoomManager;
