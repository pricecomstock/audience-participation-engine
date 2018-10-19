var express = require("express");
var State = require("./state.js").State;

function createRouter(io) {
  var rooms = []

  var choices = ['yes', 'no']
  var votes = new State(choices);
  // Socket.io Stuff
  // io.on("connection", function(socket) {
  //   // TODO: Use Namespaces to create different rooms
  //   // DOCS: https://socket.io/docs/rooms-and-namespaces/
  //   console.log("a user connected");
  //   io.emit("startVote", votes.choices)
  //   io.emit("results", votes.summary());
    

  //   socket.on("vote", choiceIndex => {
  //     console.log("vote", choiceIndex);

  //     // TODO: Base player stuff of of actual /join info
  //     let player = "xyz"
  //     votes.addPlayerVote(player, choiceIndex);

  //     io.emit("results", votes.summary());
  //   });
  // });

  // TODO Change code generation?
  const createNewRoom = (code) => {
    let room = io.on("connection", (socket) => {
      // io is the server
      // socket is the client connection

      console.log(code, "a user connected");
      io.emit("startVote", votes.choices)
      io.emit("results", votes.summary());
      
      socket.on("room", room => { // client will use this to join a room
        // TODO validate room exists
        socket.join(room)
      }) 
  
      socket.on("vote", voteInfo => {
        console.table(voteInfo);

        votes.addPlayerVote(voteInfo);
  
        io.emit("results", votes.summary());
      });
    });
    return room
  }
  
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
    
    router.post('/createroom', function(req, res) {
      // TODO: Maybe needs to be an array of objects with room metadata
      rooms.push(createNewRoom('TEST'))
      res.json({success: true, code: 'TEST'})
    });

    // TODO: implement namespace "garbage collection"
    
    return router
  }
  
  // Export
  module.exports.createRouter = createRouter;
