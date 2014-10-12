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

	this.showUploadPage = function(req,res,next){
		"use strict";
		res.sendFile('views/uploadImage.html', {root: __dirname });
	}
	
	this.upload = function(req,res,next){
		"use strict";
		
		/*Verify If event exists*/
		var eventId = parseInt(req.body.eventId);
		if(null == eventId)
		{
			console.log('Error eventId delivered to /upload');
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
				        }
				        else
				        {
				        	res.send('File uploaded to: ' + target_path + ' - ' + req.files.upload.size + ' bytes');
				        }
			    	});
			    	
			    	events.increaseImageCounterForEvent(eventId);
				}
				else
				{
					res.send('event #' + eventId + ' is closed');
				}
			});
		}		
		
	}

	this.deleteAllImages = function(req,res,next){
		utilities.deleteAllImages();
		imageCounter = 1;
		res.write('All files were deleted!');
		res.end();
	};
}

module.exports = UploadHandler;