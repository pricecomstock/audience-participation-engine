// DELETETHIS: Whole file probably

class State {
  constructor(choices) {
    // this._id = idGen(ID_LENGTH);

    // this._players = [];

    this._choices = choices

    this._playerChoices = {}
  }

  get players() {
    return this._players;
  }

  get choices() {
    return this._choices;
  }

  // TODO: Add player object and use that to track player votes and states.
  // It would probably work ok across different games and stuff too.
  addPlayer(player) {
    this._players.push(player);
  }

  summary() {
    // TODO: Match this to new summary format instead of just being an array
    console.log(this._playerChoices)
    let votes = Object.values(this._playerChoices)
    console.log(votes)
    return Object.values(votes)
  }

  addPlayerVote(voteInfo) {
    this._playerChoices[voteInfo.playerName] = voteInfo.choiceIndex
  }
}

module.exports.State = State;
