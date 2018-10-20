var Room = require("./room");

// TODO: implement namespace "garbage collection"

function generateCode() {
  const codeLength = 4;
  const validCharacters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

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

    this._io = io;
  }

  get rooms() {
    return this._rooms;
  }

  createNewRoom(roomData) {
    let newRoom = new Room(this.randomAvailableRoomCode(), this._io, roomData);
    this._rooms.push(newRoom);
    return newRoom.code;
  }

  randomAvailableRoomCode() {
    let potentialCode = "";

    // Keep generating codes until one is not taken
    do {
      potentialCode = generateCode();
    } while (
      this._rooms
        .map(room => {
          return room.code;
        })
        .includes(potentialCode)
    );

    return potentialCode;
  }
}

module.exports = RoomManager;