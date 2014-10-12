var express = require('express')
  , routes = require('./routes')
  , utilities = require('./utilities')
  , configuration = require('./configuration')
//  , http = require('http')
  , path = require('path')
  , MongoClient = require('mongodb').MongoClient // Driver for connecting to MongoDB;
  , methodOverride = require('method-override')
  , logger = require('morgan')
  , errorHandler = require('errorhandler')
  , bodyParser = require('body-parser')
  , multer = require('multer');; 

var app = express();

MongoClient.connect(configuration.uri, function(err, db) {
  "use strict";
  if(err) throw err;

  app.set('port', process.env.PORT || 3000);
  app.set('views', __dirname + '/views');
  app.set('view engine', 'jade');
//  app.use(express.favicon());
//  app.use(express.bodyParser());
//  app.use(express.multipart({ keepExtensions: true, uploadDir: __dirname + configuration.targetImagesDirectory }));
//  app.use(express.bodyParser({ keepExtensions: true, uploadDir: __dirname + configuration.targetImagesDirectory }));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
//  app.use(multer({ dest: __dirname + configuration.targetImagesDirectory }));
  
  
  app.use(methodOverride());
//  app.use(app.router);
  //app.use(express.static(path.join(__dirname, 'public')));
  app.use(configuration.targetImagesDirectory, express.static(__dirname + configuration.targetImagesDirectory));
  app.use('/public/stylesheets/', express.static(__dirname + '/public/stylesheets/'));
  app.use('/public/js/', express.static(__dirname + '/public/js/'));

  // development only
  if ('development' == app.get('env')) 
  {
//    app.use(express.errorHandler());
//  app.use(express.logger('dev'));
	  app.use(errorHandler());
	  app.use(logger('dev'));
  }
  
  utilities.initFileSystem();
  // Application routes
  routes(app, db);
  
  app.listen(app.get('port'));
  console.log('SendAPic server listening on port ' + app.get('port'));
});
