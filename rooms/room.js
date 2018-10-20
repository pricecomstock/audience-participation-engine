class Room {
  constructor(code, io, data) { //TODO: Add game options
    this._code = code

    this._players = [];

    this._roomio = io.on("connection", (socket) => {
        // io is the server
        // socket is the client connection

        // Startup tasks
        console.log(code, "a user connected");
        
        // When client joins a room
        socket.on("room", room => { // client will use this to join a room
          // TODO validate room exists
          socket.join(room)
          // TODO this should pass the whole room state instead
          io.emit("startVote", votes.choices)
          io.emit("results", votes.summary());
        }) 

        socket.on("vote", voteInfo => {
          console.table(voteInfo);
  
          votes.addPlayerVote(voteInfo);
    
          io.emit("results", votes.summary());
        });
      });

    // TODO: Create options state

    // TODO: Create player vote state
  }

  get players() {
    return this._players;
  }

  get code() {
    return this._code;
  }

  // TODO: Add player object and use that to track player votes and states.
  // It would probably work ok across different games and stuff too.
  addPlayer(player) {
    this._players.push(player);
  }

  // TODO: Implement player vote methods
  // castVote(player, vote) {

  // }
}

module.exports.Room = Room;
