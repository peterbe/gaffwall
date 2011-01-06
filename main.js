// in ./app.js we did "module.exports", allowing
// us to grab the app from the parent module (the one
// which required it)
var app = module.parent.exports;

var fs = require('fs'),
    sys = require('sys'),
    spawn = require('child_process').spawn
    express = require('express');//,
//    mongo = require('./node-mongodb-native/lib/mongodb');

var gm = require('./external/gm');

//var Db = require('./node-mongodb-native/lib/mongodb').Db,
//  Connection = require('./node-mongodb-native/lib/mongodb').Connection,
//  Server = require('./node-mongodb-native/lib/mongodb').Server,
//  BSON = require('./node-mongodb-native/lib/mongodb').BSONPure;
  // BSON = require('../nlib/mongodb').BSONNative;
  // See this about using BSONNative
  // http://groups.google.com/group/node-mongodb-native/browse_thread/thread/42fd8a968322a623#
  //
  //
var db_host = process.env['MONGO_NODE_DRIVER_HOST'] != null ? 
  process.env['MONGO_NODE_DRIVER_HOST'] : 'localhost';
var db_port = process.env['MONGO_NODE_DRIVER_PORT'] != null ? 
  process.env['MONGO_NODE_DRIVER_PORT'] : '27017';//mongo.Connection.DEFAULT_PORT;
var db_name = process.env['DATABASE_NAME'] != null ? 
  process.env['DATABASE_NAME'] : 'task-calendar';

//require.paths.unshift('external/mongoose');
//var mongoose = require('mongoose').Mongoose;

//var db = new mongo.Db(db_name, new mongo.Server(db_host, db_port, {}), {native_parser: false});
//var db = mongoose.connect('mongodb://' + db_host + ':' + db_port + '/' + db_name);

/* ************** I wish I could do this in a separate file 
mongoose.model('User', {
  collection: 'users',
     properties: ['username', 'email', 'password', 'first_name', 'last_name', 
		  'guid', 'date_joined', 'last_user_agent', 'add_date', 'modify_date'],
     indexes: ['guid'],
     getters: {
         full_name: function() {
	    return this.first_name + ' ' + this.last_name;
         }
     },
   
   methods: {
      save: function(fn) {
	 this.modify_date = new Date();
	 this.__super__(fn);
      }
   }
});

mongoose.model('Event', {
collection: 'events',
     properties: ['title','all_day','start','end','user','add_date','modify_date'],
     methods: {
      save: function(fn) {
	 this.modify_date = new Date();
	 this.__super__(fn);
      }
   }
     
});
 */

/* ************** I wish I could do this in a separate file */

//mongoose.load('./models');
//var User = db.model('User');
//var Event = db.model('Event');

//sys.puts('Connecting to MongoDB on ' + db_host + ':' + db_port);



app.configure(function() {
   //app.use(express.logger({ format: ':method :url :status' }));
   app.use(express.methodOverride());
   app.use(express.bodyDecoder());
   //app.use(express.cookieDecoder()); //Required by session() middleware
   app.use(app.router);
   app.use(express.staticProvider(__dirname + '/static'));
   
   // Populates:
   //   - req.session
   //   - req.sessionStore
   //   - req.sessionHash (the SID fingerprint)
   //express.session();
   
   app.set('views', __dirname + '/views');
   app.set('view options', {layout: false});
   app.register('.html', require('ejs'));
});

app.get('/', function(req, res) {
   res.render('wall.html');
});

app.get('/paint', function(req, res) {
   res.render('paint.html');
});

app.post('/paint/doodle', function(req, res) {
   var r = req.body.r;
   var lat = req.body.lat;
   var lon = req.body.lon;
   
   var ps = spawn('./static/tiles/testsavecanvas.py', [r, lat, lon]);
   ps.stdin.end();
   ps.stdout.on('data', function (data, secondthing) {
      L("Thanks!");
   });
   ps.stderr.on('data', function(data) {
      if (/^execvp\(\)/.test(data.asciiSlice(0,data.length))) {
         console.log('Failed to start child process.');
      } else {
         L(data.toString('ascii'));
      }
   });
   
   res.send("Cool");
});

app.get('/tiles/:size/:z/:row,:col\.png', function(req, res) {
   //console.log(req.params);
   var size = parseInt(req.params.size),
       zoom = parseInt(req.params.z),
       row = parseInt(req.params.row),
       col = parseInt(req.params.col);
   
   if (size != 256) 
     throw "Must be 256px size";
   
   var width = size * Math.pow(2, zoom);
   var filename = 'static/tiles/' + size + '/' + zoom + '/' + row + ',' + col + '.png';
   
   
   gm('static/tiles/worldmap.png')
     .resize(width, width)
     .crop(size, size, row * size, col * size)
     .write(filename, function(err){
        if (err) {
           L("ERROR", err);
           res.sendfile('static/tiles/broken.png');
        } else 
          res.sendfile(filename);
     });
       
   /*
   var ps    = spawn('./static/tiles/createtiles.py', ['static/tiles', zoom, x, y]);
   ps.stdin.end();
   ps.stdout.on('data', function (data, secondthing) {
      L('Just created:', data.toString('ascii'));
      res.sendfile(trim(data.toString('ascii')));
   });
   ps.stderr.on('data', function(data) {
      if (/^execvp\(\)/.test(data.asciiSlice(0,data.length))) {
         console.log('Failed to start child process.');
      } else {
         L(data.toString('ascii'));
      }
   });
   */
   //res.sendfile('1583.png');
   //res.send("working on it");
});

app.post('/paint/save', function(req, res) {
//   L(req);
   var data = req.body.data;
   var zoom = req.body.zoom;
   var x = req.body.x;
   var y = req.body.y;
   
   var ps = spawn('./static/tiles/savecanvas.py', [data, zoom, x, y]);
   ps.stdin.end();
   ps.stdout.on('data', function (data, secondthing) {
      L('Just created:', data.toString('ascii'));
      res.sendfile(trim(data.toString('ascii')));
   });
   ps.stderr.on('data', function(data) {
      if (/^execvp\(\)/.test(data.asciiSlice(0,data.length))) {
         console.log('Failed to start child process.');
      } else {
         L(data.toString('ascii'));
      }
   });
   
   res.send("Thanks!");
});

var rtrim = /^(\s|\u00A0)+|(\s|\u00A0)+$/
var trim = function( text ) {
   return (text || "").replace( rtrim, "" );
}



function L() {
   for (var i = 0, l = arguments.length; i < l; i++)
     console.log(arguments[i]);
}

