var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var createRouter = require("./router.js").createRouter;
var serveStatic = require("serve-static");

var State = require("./state.js").State;

// FIX: figure out actual CORS rules
// This is for development mostly
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

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

api = createRouter(io)

app.use("/api", api);

// TODO: make it so incorrect API calls don't fall through to vue-router

// Everything else should fall through to vue-router
app.get("/*", function(req, res) {
  // FIX: This path might be incorrect for Vue-CLI 3
  res.sendFile(__dirname + "/dist/index.html");
});

var port = process.env.PORT || 5000;
http.listen(port);

console.log("server started " + port);
