var express = require("express");
var State = require("./state.js").State;

function createRouter(io) {
  var choices = ['yes', 'no']
  var votes = new State(choices);
  // Socket.io Stuff
  io.on("connection", function(socket) {
    // TODO: Use Namespaces to create different rooms
    // https://socket.io/docs/rooms-and-namespaces/
    console.log("a user connected");
    io.emit("startVote", votes.choices)
    io.emit("results", votes.summary());
    

    socket.on("vote", choiceIndex => {
      console.log("vote", choiceIndex);

      // TODO: Base player stuff of of actual /join info
      let player = "xyz"
      votes.addPlayerVote(player, choiceIndex);

      io.emit("results", votes.summary());
    });
  });
  
  var router = express.Router();
  router.use(express.json());
  
  // Base route
  router.get("/", function(req, res) {
    res.json({ message: "You are able to ping the API!" });
  });
  
  //-----//
  // GET //
  //-----//
  
  // router.get('/path', function(req, res) {
  //     res.json({success: true})
  // });
  
  //------//
  // POST //
  //------//
  
  router.get('/createroom', function(req, res) {
      res.json({success: true})
  });

  return router
}

// Export
module.exports.createRouter = createRouter;
