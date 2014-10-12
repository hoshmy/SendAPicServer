var fs = require('fs')
	,configuration = require('./configuration')
    ,utilities = require('./utilities')
    ,path = require("path")
    ,DownloadsDAO = require('./routes/downloads').DownloadsDAO
    ,EventsDAO = require('./routes/events').EventsDAO;

function DownloadHandler(db){
	"use strict";

	var downloads = new DownloadsDAO(db);
	var events = new EventsDAO(db);
	var filesDeletionQueue = [];

	this.download = function(req,res,next){
		"use strict";
		console.log('req.url: ' + req.url);
		events.consumeDownloadImageIfApplicable(parseInt(req.query.eventId),function(_err,_index){
			"use strict";
			if(_err)
			{
				res.writeHead(200, {'Content-Type': 'text/plain' });
				var message = 'Error get event document for event: ' + req.query.eventId;
			    res.end(message + '\n');
				console.dir(message);
				return;
			}
			else
			{
				var directory = path.join(__dirname, configuration.targetImagesDirectory,req.query.eventId);
//				console.dir("sss: " + directory);

				fs.readdir(directory,function(err, _files){
					"use strict";
					if(err)
					{
						console.log('Error occured while reading dir:\n' + err);
						res.writeHead(200, {'Content-Type': 'text/plain' });
					    res.end('Error reading directory' + err + '\n');
					}
					else
					{
						var filesInDir = _files;
						if(_index && filesInDir.length)
						{
							/*Scan filesInDir array to verify that the file to download exists*/
							var fileName = _index.toString() + ".jpg";
							if(0 <= filesInDir.indexOf(fileName))
							{/*The file exists*/
								var fileFullPath = directory +"/" +fileName;
								
//								var options = {
//								root: directory,
//								dotfiles: 'deny',
//								headers: {
//								    'x-timestamp': Date.now(),
//								    'x-sent': true
//									}
//								};
//
//								res.sendFile(fileName, options, function (err) {
//									if (err) {
//									  console.log(err);
//									  res.status(err.status).end();
//									}
//									else {
//									  console.log('Sent:', fileName);
//									}
//								});
								
								
								
								
								res.download(fileFullPath,fileName,function(err){
									if (err) 
									{
										// handle error, keep in mind the response may be partially-sent
										// so check res.headersSent
										console.log("ERROR downloading file ZZZ: " + err);
									}
									else 
									{
										console.log('downloading file: ' + fileFullPath);
									}
								});	
							}

						}	
					}
				});
			}
		});
	}
	
	this.downloadImageByName = function(req,res,next){
		"use strict";
		var eventId = req.query.eventId;
		var directory = path.join(__dirname, configuration.targetImagesDirectory,eventId.toString()+'/');
		fs.readdir(directory,function(err, files){
			"use strict";
			if(err)
			{
				console.log('Error occured while reading dir:\n' + err);
				res.writeHead(200, {'Content-Type': 'text/plain' });
			    res.end('Error reading directory' + err + '\n');
			}
			else
			{
				var requestedFileName = req.query.imageName + '.jpg';
				var requestedFileIndex = -1;
				for(var fileIndex=0; fileIndex<files.length;++fileIndex)
				{
					if(files[fileIndex] == requestedFileName)
					{
						requestedFileIndex = fileIndex;
						break;
					}
				}
				
				if(requestedFileIndex == -1)
				{/*file Not Found*/
					res.writeHead(200, {'Content-Type': 'text/plain' });
				    res.end('File ' + requestedFileName + ' not found');
				}
				else
				{/*file found*/
					var file = directory + requestedFileName;
					res.download(file,requestedFileName);
				}
			}
		});
	};

	this.ackImageDownload = function(req,res,next){
		var fileForDeletion = req.body;
		console.log('Asking To Delete file ' + fileForDeletion);
		
		var isFileInDeletionQueue = filesDeletionQueue.indexOf(fileForDeletion);
		if(isFileInDeletionQueue >= 0)
		{/*the file exists - delete it*/
			var directory = path.join(__dirname, '\..\\',configuration.targetImagesDirectory);
			var file = directory + fileForDeletion;
			fs.unlink(file);
			filesDeletionQueue.splice(isFileInDeletionQueue,1);
			res.status(200);
			res.end('File ' + fileForDeletion + ' was deleted');
		}
		else
		{
			res.status(404);
			res.end();
		}
	};

	this.resetDeleteQueue = function(req,res,next){
		filesDeletionQueue = [];
		res.status(200);
		res.end('Queue deleted');
	};
}

module.exports = DownloadHandler;