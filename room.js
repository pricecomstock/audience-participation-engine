const idGen = require('./idgenerate').generateCaps

const ID_LENGTH = 4

class Room {
    constructor(name) {
      this._id = idGen(ID_LENGTH);
      
      this._players = []

      // TODO: Create options state

      // TODO: Create player vote state
    }

    get players() {
      return this._players;
    }

    // TODO: Add player object and use that to track player votes and states.
    // It would probably work ok across different games and stuff too.
    addPlayer(player) {
        this._players.push(player)
    }

    // TODO: Implement player vote methods
    // castVote(player, vote) {

    // }
}

module.exports.Room = Room;