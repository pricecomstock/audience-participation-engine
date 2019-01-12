var express = require("express");
var RoomManager = require("./rooms/roomManager.js");

function createRouter(io) {
  // Set up router
  var router = express.Router();
  router.use(express.json());

  // Set up room management
  var rooms = [];
  var roomManager = new RoomManager(io);

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

  router.post("/createroom", function(req, res) {
    const newRoomInfo = roomManager.createNewRoom({ name: req.body.name });
    console.log("Created", newRoomInfo.roomCode);
    res.json({
      success: true,
      code: newRoomInfo.roomCode,
      adminKey: newRoomInfo.adminKey
    });
  });

  router.post("/checkroom", function(req, res) {
    let code = req.body.code.toUpperCase();
    console.debug("Checking existence of:", code);
    let success = roomManager.checkRoomExists(code);
    res.json({
      success: success,
      code: code
    });
  });

  return router;
}

// Export
module.exports.createRouter = createRouter;
