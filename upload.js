var fs = require('fs')
	,configuration = require('./configuration')
    ,utilities = require('./utilities')
    ,UploadsDAO = require('./routes/uploads').UploadsDAO
    ,EventsDAO = require('./routes/events').EventsDAO;



function UploadHandler(db){
	"use strict";
	
	var uploads = new UploadsDAO(db); 
	var events = new EventsDAO(db);

	var uploads = new UploadsDAO(db);
	var imageCounter = 0;

	var uploadResponse = function(res,eventId,returnCode)
	{
		console.log('upload image to event #' + eventId +' responded with code #' + returnCode );
		res.writeHead(returnCode, {'Content-Type': 'text/plain' });
	    res.end('event_id: '  + eventId);
	}
	
	
	this.showUploadPage = function(req,res,next){
		"use strict";
		res.sendFile('views/uploadImage.html', {root: __dirname });
	}
	
	this.upload = function(req,res,next){
		"use strict";
		
		/*Verify If event exists*/
		var returnCode = configuration.CELL_eventNotExists;
		var event_idString = req.headers.event_id;
		var eventIdString = req.body.eventId;
		var eventId = 0;

		if(event_idString != null)
		{
			eventId = parseInt(event_idString);
		}
		else if(eventIdString != null)
		{
			eventId = parseInt(eventIdString);
		}
		else
		{
			eventId = null;		
		}
		
		if(null == eventId)
		{
//			console.log('Error eventId delivered to /upload');
			uploadResponse(res,null,configuration.CELL_eventNotExists);
		}
		else
		{
			events.getEventDoc(eventId,function(err,_isOpen,_event){
//				"use strict";
				if(_isOpen)
				{
					// get the temporary location of the file
			    	var tmp_path = req.files.upload.path;		
			    	var target_path = '.' + configuration.targetImagesDirectory
			    						  + eventId  + '/'
			    						  +	_event.newImageCounter + '.jpg';
			    	
			    	//TODO increment image Counter
			    	
			    	fs.rename(tmp_path, target_path, function(err) {
			    		"use strict";
				        if (err)
				        {
				        	console.log(err);
				        	uploadResponse(res,eventId,configuration.CELL_serverCouldntReceiveImage);
				        }
				        else
				        {
//				        	res.send('File uploaded to: ' + target_path + ' - ' + req.files.upload.size + ' bytes');
				        	uploadResponse(res,eventId,configuration.CELL_serverReceivedImage);

				        }
			    	});
			    	
			    	events.increaseImageCounterForEvent(eventId);
				}
				else
				{
		        	uploadResponse(res,eventId,configuration.CELL_eventNotExists);
//					res.send('event #' + eventId + ' is closed');
				}
			});
		}
	};
	
	this.uploadTextMessage = function(req,res,next){
		"use strict";
		
		/*Verify If event exists*/
		var returnCode = configuration.CELL_eventNotExists;
		var event_idString = req.headers.event_id;
		var eventIdString = req.query.event_id;
//		var eventIdString = req.body.eventId;
		var eventId = 0;
		
		var text_message = req.headers.text_message;
		var text_message2 = req.query.text_message;
//		var text_message2 = req.body.text_message;

		if(event_idString != null)
		{
			eventId = parseInt(event_idString);
		}
		else if(eventIdString != null)
		{
			eventId = parseInt(eventIdString);
		}
		else
		{
			eventId = null;		
		}
		
		if(text_message == null && text_message2 != null)
		{
			text_message = text_message2;
		}
		
		if(null == eventId)
		{
//			console.log('Error eventId delivered to /upload');
			uploadResponse(res,null,configuration.CELL_eventNotExists);
		}
		else
		{
			events.uploadTextMessageToEvent(eventId,text_message,function(_returnCode){

				uploadResponse(res,eventId,_returnCode);

			});
		}
//		
	};
	
	this.deleteAllImages = function(req,res,next){
		utilities.deleteAllImages();
		imageCounter = 1;
		res.write('All files were deleted!');
		res.end();
	};
}

module.exports = UploadHandler;