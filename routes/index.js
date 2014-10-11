var EventHandler = require('../event')
  , UploadHandler = require('../upload')
  , DownloadHandler = require('../download')
  , multipart = require('connect-multiparty')
  , configuration = require('../configuration')
  , path = require("path");
// , ErrorHandler = require('../error').consoleErrorHandler;


var uploadDirectory = path.join(__dirname,"..",configuration.targetImagesDirectory);
var multipartMiddleware = multipart({ keepExtensions: true, uploadDir: uploadDirectory });


module.exports = exports = function(app, db) {

	/*Handlers*/
	var eventHandler = new EventHandler(db);
	var uploadHandler = new UploadHandler(db);
	var downloadHandler = new DownloadHandler(db);

	/*Events*/
	app.get('/createNewEvent', eventHandler.displayCreateNewEventPage);
	app.post('/postNewEvent' , eventHandler.createNewEvent);

	/*Upload*/
	app.get('/deleteAllImages',uploadHandler.deleteAllImages);
	app.post('/upload',multipartMiddleware,uploadHandler.upload);
	app.get('/',uploadHandler.showUploadPage);

	/*Download*/
	app.get('/resetDeleteQueue',downloadHandler.resetDeleteQueue);
	app.post('/ackImageDownload',downloadHandler.ackImageDownload);
	app.get('/download',downloadHandler.download);
	app.get('/downloadImageByName',downloadHandler.downloadImageByName);
};