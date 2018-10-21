var Room = require("./room");

// TODO: implement namespace "garbage collection"

function generateCode() {
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
          socket.nickname = "newplayer";
          socket.emoji = "grin";
          socket.roomCode = roomCode;
          console.log(io.sockets.adapter.rooms[roomCode]);
          sendRoomUpdates(roomCode);
        }
        // TODO Probably need to do something different on joining a room than normal updates, we'll see
        // io.in(this.code).emit("startVote", this.choices);
        // io.in(this.code).emit("results", this.summary());
      });

      socket.on("setplayerinfo", info => {
        socket.nickname = info.nickname;
        socket.emoji = info.emoji;
      });

      socket.on("vote", voteInfo => {
        if (this.checkRoomExists(socket.roomCode)) {
          console.table(voteInfo);
          let playerRoom = this.getRoomWithCode(socket.roomCode)
          playerRoom.addPlayerVote(voteInfo);
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
    let newRoom = new Room(this.randomAvailableRoomCode(), this._io, roomData);
    this._rooms.push(newRoom);
    console.log(this._rooms)
    return newRoom.code;
  }

  randomAvailableRoomCode() {
    let potentialCode = "";

    // Keep generating codes until one is not taken
    do {
      potentialCode = generateCode();
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
