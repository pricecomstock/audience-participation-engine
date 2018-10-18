var express = require('express');

var router = express.Router();
router.use(express.json());

// Base route
router.get('/', function(req, res) {
    res.json({ message: 'You are able to ping the API!' });   
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

// router.get('/path', function(req, res) {
//     res.json({success: true})
// });


// Export
module.exports.router = router