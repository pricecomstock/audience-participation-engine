class Room {
  constructor(code, io, data) {
    //TODO: Add game options
    this._code = code;
    this._players = [];

    // Room state
    this._choices = ['yee', 'nah']
    this._playerChoices = {}

    

    // TODO: Create options state

    // TODO: Create player vote state
  }
  
  get code() {
    return this._code;
  }
  
  get choices() {
    return this._choices;
  }

  getPlayerWithId(playerId) {
    return this._players.find(playerSocket => {
      return playerSocket.playerId === playerId;
    })
  }
  
  // TODO: Add player object and use that to track player votes and states.
  // It would probably work ok across different games and stuff too.
  addPlayer(socket) {
    this._players.push(socket);
  }
  
  get players() {
    return this._players;
  }

  addPlayerVote(playerId, choiceIndex) {
    console.log(playerId, "voted for", choiceIndex)
    this._playerChoices[playerId] = choiceIndex
  }

  summary() {
    // TODO: Match this to new summary format instead of just being an array
    console.table(this._playerChoices)
    let votes = Object.values(this._playerChoices)
    console.log(votes)
    let state = {
      voteValues: Object.values(votes),
      choices: this.choices,
      playerChoices: this._playerChoices,
      players: this.players
    }
    return state
  }
}

module.exports = Room;
