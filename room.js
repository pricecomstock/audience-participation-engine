const idGen = require('./idgenerate').generateCaps

const ID_LENGTH = 4

class Room {
    constructor(name) {
      this._id = idGen(ID_LENGTH);
      
      this._players = []
    }

    // Getters and Setters
    // set secondsRemaining(seconds) {
    //   if (seconds >= 0) {
    //     this._secondsRemaining = seconds;
    //   }
    // }

    get players() {
      return this._players;
    }

    addPlayer(player) {
        this._players.push(player)
    }

    // castVote(player, vote) {

    // }
}

module.exports.Room = Room;