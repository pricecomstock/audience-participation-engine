class Room {
  constructor(code, data) {
    //TODO: Add game options
    this._code = code;
    
    // Room state
    this._choices = ['yee', 'nah']
    this._players = [];
  }
  
  get code() {
    return this._code;
  }
  
  get choices() {
    return this._choices;
  }

  getPlayerWithId(playerId) {
    return this._players.find(player => {
      return player.playerId === playerId;
    })
  }
  
  // TODO: Add player object and use that to track player votes and states.
  // It would probably work ok across different games and stuff too.
  addPlayer(player) {
    this._players.push(player);
  }
  
  get players() {
    return this._players;
  }

  addPlayerVote(playerId, choiceIndex) {
    console.log(playerId, "voted for", choiceIndex, this._choices[choiceIndex])
    this.getPlayerWithId(playerId).choiceIndex = choiceIndex;
  }

  summary() {
    // TODO: Match this to new summary format instead of just being an array
    console.table(this._players)
    let state = {
      choices: this.choices,
      players: this.players
    }
    return state
  }
}

module.exports = Room;
