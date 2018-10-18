var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var api = require("./router.js").router;
var serveStatic = require("serve-static");

// FIX: figure out actual CORS rules
// This is for development mostly
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "http://localhost:8080");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

var votes = [];
// Socket.io Stuff
io.on("connection", function(socket) {
  console.log("a user connected");
  io.emit("results", votes);

  socket.on("vote", value => {
    console.log("vote", value);
    votes.push(value);

    io.emit("results", votes);
  });
});

app.use("/api", api);

// TODO: make it so incorrect API calls don't fall through to vue-router

// Everything else should fall through to vue-router
app.get("/*", function(req, res) {
  res.sendFile(__dirname + "/dist/index.html");
});

var port = process.env.PORT || 5000;
var server = http.listen(port);

console.log("server started " + port);
