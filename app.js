/**
 * Module dependencies.
 */

var express = require('express');

// Our app IS the exports, this prevents require('./app').app,
// instead it is require('./app');
var app = module.exports = express.createServer(
    //express.logger(),
    express.logger({ format: ':method :url :status' }),

    // Required by session() middleware
    express.cookieDecoder(),

    // Populates:
    //   - req.session
    //   - req.sessionStore
    //   - req.sessionHash (the SID fingerprint)
    express.session()
);

// Illustrates that an app can be broken into
// several files, but yet extend the same app
require('./main')
//require('./contact');

// Illustrates that one app (Server instance) can
// be "mounted" to another at the given route.
//app.use('/task', require('./tasks'));

app.listen(8000);
console.log("App started on http://127.0.0.1:8000");
