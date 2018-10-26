var Room = require("./room");
const crypto = require("crypto");

// TODO: implement namespace "garbage collection"

function generatePlayerId(characters) {
  // Synchronous
  // 3 bytes = 4 base 64 characters
  const num_bytes = Math.floor(characters * 0.75);
  const buf = crypto.randomBytes(num_bytes);
  return buf
    .toString("base64")
    .replace(/\//g, "_")
    .replace(/\+/g, "-");
}

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

      let sendRoomUpdates = roomCode => {
        let roomToUpdate = this.getRoomWithCode(roomCode);
        io.in(roomCode).emit("state", roomToUpdate.summary());
      };

      // Startup tasks
      // console.log(code, "a user connected");

      // When client joins a room
      socket.on("room", data => {
        // client will use this to join a room
        const roomCode = data.roomCode;
        const requestedId = data.requestedId;

        class Player {
          constructor() {
            this.connected = true;
            this.nickname = "human-" + generatePlayerId(2);
            this.emoji = "😀";
            this.playerId = generatePlayerId(12);
            this.choiceIndex = -1;
          }
        }

        if (socket.rooms) {
          // socket already was in a room
          socket.leaveAll();
          socket.roomCode = "";
        }

        if (this.checkRoomExists(roomCode)) {
          let joinedRoom = this.getRoomWithCode(roomCode);
          console.log("Joined room code", roomCode);
          socket.join(roomCode);
          socket.roomCode = roomCode;

          if (requestedId) {
            console.log("player reconnecting");
            let existingPlayer = joinedRoom.getPlayerWithId(requestedId);
            if (existingPlayer) {
              console.log("Player exists!", existingPlayer);
              socket.player = existingPlayer;
              socket.player.connected = true;
            } else {
              console.log("Player does not exist, creating a new one.");
              socket.player = new Player();
            }
          } else {
            socket.player = new Player();
            joinedRoom.addPlayer(socket.player);
          }

          socket.emit("playerIdAssigned", socket.player.playerId);
          sendRoomUpdates(roomCode);
        }
      });

      socket.on("disconnect", reason => {
        if (socket.player) {
          console.log("disconnect", reason);
          socket.player.connected = false;
          // rooms are left automatically upon disconnection
          sendRoomUpdates(socket.roomCode);
        }
      });
      
      socket.on("playerreconnect", reason => {
        if (socket.player) {
          console.log("reconnect", reason);
          socket.player.connected = true;
          // rooms are left automatically upon disconnection
          sendRoomUpdates(socket.roomCode);
        }
      });

      socket.on("roomadminjoin", data => {
        let roomCode = data.roomCode;
        // TODO Also check admin key
        if (this.checkRoomExists(roomCode)) {
          socket.join(roomCode);
          socket.roomCode = roomCode;
          socket.isRoomAdmin = true;

          sendRoomUpdates(roomCode);
        }
      });

      socket.on("newchoices", newChoicesList => {
        // TODO Also check admin key
        if (this.checkRoomExists(socket.roomCode)) {
          let room = this.getRoomWithCode(socket.roomCode);
          room.newVote(newChoicesList);

          sendRoomUpdates(socket.roomCode);
        }
      });

      socket.on("resetvotes", adminKey => {
        // TODO Also check admin key
        if (this.checkRoomExists(socket.roomCode)) {
          let room = this.getRoomWithCode(socket.roomCode);
          room.resetVotes();

          sendRoomUpdates(socket.roomCode);
        }
      });
      
      socket.on("lockvotes", locked => {
        // TODO Also check admin key
        if (this.checkRoomExists(socket.roomCode)) {
          let room = this.getRoomWithCode(socket.roomCode);
          console.log("locking room")
          room.setLock(locked);

          sendRoomUpdates(socket.roomCode);
        }
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
          let playerRoom = this.getRoomWithCode(socket.roomCode);
          playerRoom.addPlayerVote(socket.player.playerId, choiceIndex);
          sendRoomUpdates(socket.roomCode);
        }
        // TODO: Else send disconnect notice or something
      });
    });
  }

  get rooms() {
    return this._rooms;
  }

  createNewRoom(roomData) {
    const adminKey = generatePlayerId(30);
    let newRoom = new Room(this.randomAvailableRoomCode(), adminKey, roomData);
    this._rooms.push(newRoom);
    console.log(this._rooms);
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
    return this._rooms.find(room => {
      return room.code === code;
    });
  }
}

module.exports = RoomManager;
