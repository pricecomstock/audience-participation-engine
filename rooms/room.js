class Room {
  constructor(code, io, data) {
    //TODO: Add game options
    this._code = code;
    this._players = [];

    // Room state
    this._choices = ['yee', 'nah']
    this._playerChoices = {}

    // TODO figure out where state.js goes in here
    this._roomio = io.on("connection", socket => {
      // io is the server
      // socket is the client connection
      let roomEmit = io.to(this.code).emit;

      // Startup tasks
      console.log(code, "a user connected");

      // When client joins a room
      socket.on("room", room => {
        // client will use this to join a room
        // TODO validate room exists somewhere else eventually to prevent malicious attacks
        socket.join(room);
        // TODO this should pass the whole room state instead
        roomEmit("startVote", this.choices);
        roomEmit("results", this.summary());
      });

      socket.on("vote", voteInfo => {
        console.table(voteInfo);

        this.addPlayerVote(voteInfo);

        roomEmit("results", this.summary());
      });

      socket.on("watchtovote", data => {
        console.log("passing to clients:", data)
        io.emit("broadcast", data)
      })
    });

    // TODO: Create options state

    // TODO: Create player vote state
  }
  
  get code() {
    return this._code;
  }
  
  get choices() {
    return this._choices;
  }
  
  // TODO: Add player object and use that to track player votes and states.
  // It would probably work ok across different games and stuff too.
  addPlayer(player) {
    this._players.push(player);
  }
  
  get players() {
    return this._players;
  }

  addPlayerVote(voteInfo) {
    this._playerChoices[voteInfo.playerName] = voteInfo.choiceIndex
  }

  summary() {
    // TODO: Match this to new summary format instead of just being an array
    console.log(this._playerChoices)
    let votes = Object.values(this._playerChoices)
    console.log(votes)
    return Object.values(votes)
  }
}

module.exports = Room;
