var express = require('express');
var api = require('./router.js').router;
var serveStatic = require('serve-static');

var Gun = require('gun')



app = express();
app.use(serveStatic(__dirname));
app.use('/gun', Gun.serve);

// This is for development mostly
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization");
    next();
});  

// Use all those above routes for the API
app.use('/api', api);

// TODO: make it so incorrect API calls don't fall through to vue-router

// Everything else should fall through to vue-router
app.get('/*', function (req, res) {
    res.sendFile(__dirname + '/index.html');
});

var port = process.env.PORT || 5000;
var server = app.listen(port);

var gun = Gun({web: server})

console.log('server started ' + port);

// gun.get('users').put({
//     name2: "Pc",
//     email2: "pccdkjfsd@kjfsd.co"
// })
gun.get('votes/TESTVOTES').on( (data, key) => console.log("update:", data))