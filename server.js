var app = require("express")();
var http = require("http").Server(app);
var io = require("socket.io")(http);
var createRouter = require("./router.js").createRouter;
var serveStatic = require("serve-static");

// This is for development mostly
app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  next();
});

const api = createRouter(io);

app.use("/api", api);

// TODO: make it so incorrect API calls don't fall through to vue-router

// Everything else should fall through to vue-router
app.use(serveStatic(__dirname + "/dist"));
app.get("/*", function(req, res) {
  // FIX: This path might be incorrect for Vue-CLI 3
  res.sendFile(__dirname + "/dist/index.html");
});

var port = process.env.PORT || 5000;
http.listen(port);

console.log("server started " + port);
