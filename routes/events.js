var utilities = require('../utilities')
  , configuration = require('../configuration');


function EventsDAO(db) {
    "use strict";

     /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof EventsDAO)) {
        console.log('Warning: EventsDAO constructor called without "new" operator');
        return new EventsDAO(db);
    }

    var events = db.collection(configuration.eventsCollection);
	
	this.createNewEvent = function(event, callback) {
        "use strict";
        var doc = event;
        var eventId = -1;
        do
        {
        	eventId = Math.floor((Math.random()*configuration.eventIdMultiplier + 1));
        }while(this.isEventIdExists(eventId)==false);
        
        doc['_id'] = eventId;
        doc['event_open_date'] = new Date();
        
        // Insert event document
        events.insert(doc, function (err, result) {
            "use strict";
            callback(err, eventId);
        });
    }

    this.isEventIdExists = function(id){
    	"use strict";
    	if(id == configuration.defaultEventId)
		{//hack!
    		return true;
		}
    	
    	events.find({_id: id}).limit(1).count(function(err, count) {
    		"use strict";
    		if(err)throw err;
    		var isIdExists = (count==0);
    		if(isIdExists)
    		{
    			console.log('An existing id was generated: ' + id);
    		}
    		else
    		{
    			console.log('A NON existing id was generated: ' + id);
    		}

    		return isIdExists;
    	});
    } 
    
    this.getEvent = function(_eventId,callback){
    	//callback(err,event)
    	"use strict";
    	events.findOne({_id: _eventId},callback);
    }
    
    this.isEventOpen = function(_eventId,callback){
    	//callback(err,bool)
    	"use strict";
    	
    	if(_eventId == configuration.defaultEventId)
		{//hack!
    		callback(null,true);
		}
    	else
		{
	    	this.getEvent(_eventId,function(err,event){
	    		"use strict";
	    		if(err)
				{
	    			callback(err,false);
				}
	    		else if(null == event)
    			{
	    			callback(null,false);
    			}
	    		else
				{
	    			var isOpen = false;
	    			var now = new Date();//TODO: should delete?????
	    			if(now > event.startDate && now < event.stopDate)
	    			{
	    				isOpen = true;
	    			}
	    			
					callback(null,isOpen);
				}
	    	});
		}
    }
    	
    	
	this.getEventDoc = function(_eventId,callback)
	{
		//callback(err,_isOpen,event)
		"use strict";

    	this.getEvent(_eventId,function(err,event){
    		"use strict";
    		if(err)
			{
    			callback(err,false,null);
			}
    		else if(null === event)
			{
    			callback(null,false,null);
			}
    		else
			{
    			var isOpen = false;
    			var now = new Date();//TODO: should delete?????
    			if(now > event.startDate && now < event.stopDate)
    			{
    				isOpen = true;
    			}
    			
				callback(null,isOpen,event);
			}
		});
	}
	
	
	this.consumeDownloadImageIfApplicable = function(_eventId,callback)
	{//callback(err,_downloadAvailableIndex)
		"use strict";
		events.findAndModify({$and:[{_id:_eventId},{numOfDownloads:{"$gt":0}}]},{},{$inc:{downloadImageIndex:1,numOfDownloads:-1}},{"new":true},function(err,doc){
			"use strict";
			if(err)
			{
				console.log('Zalupa cant find has error: ' + err);
				callback(err,null);
			}
			else
			{
				if(doc)
				{	
					console.log('Zalupa found: ' + JSON.stringify(doc) + ' eventid: ' +_eventId);
					callback(null,doc.downloadImageIndex-1);
				}
				else
				{
					callback("Error finding doc!",null);
				
				}
			}
		});
	}
    	
	this.increaseDownloadImageIndexForEvent = function(_eventId)
	{
    	"use strict";
		events.update({_id:_eventId},{$inc:{downloadImageIndex:1,numOfDownloads:-11}},function(err,updated){
			if(err)
			{
				console.log('Error in increaseDownloadImageIndexForEvent for event: '+_eventId);
			}
			else
			{
				console.log('Successfully increaseDownloadImageIndexForEvent for event : ' + _eventId);
			}
		});
	}
	
	this.increaseImageCounterForEvent = function(_eventId)
	{
		"use strict";
		 events.update({_id:_eventId},{$inc:{'newImageCounter':1,'numOfDownloads':1}},function(err,updated){
			 "use strict";
			 if(err)
			 {
				 console.log('Error updating new image counter');
			 }
			 else
			 {
				 console.log('successfully updated new image counter to: '+ updated["newImageCounter"] +' for event: ' + _eventId);
			 }	 
		 });   		
	}
	
	this.uploadTextMessageToEvent = function(_eventId,_textMessage,callback)
	{//callback(_returnCode)
		"use strict";
		
		this.isEventOpen(_eventId,function(_err,_isOpen){
			"use strict";
			if(_err || false == _isOpen)
			{
				callback(configuration.CELL_eventNotExists);
			}
			else
			{
				events.update({_id:_eventId},{$push:{"textMessages":_textMessage}},function(_err,_updated){
					 "use strict";
					 if(_err)
					 {
						 callback(configuration.CELL_serverCouldntReceiveTextMessage);
					 }
					 else
					 {
						 callback(configuration.CELL_serverReceivedTextMessage);
					 }
				});
			}
		});
	}
	
	this.consumeTextMessageIfExists = function(_eventId,callback)
	{//callback(err,returnCode,message)
		events.findAndModify({_id:_eventId},{},{$pop:{"textMessages":-1}},{"new":false},function(err,doc){
			"use strict";
			if(err)
			{
				callback(err,configuration.PCA_generalErrorInServer,null);
			}
			else
			{
				if(null == doc)
				{	
					callback(null,configuration.PCA_eventNotExists,null);
				}
				else
				{/*update performed*/
					if(doc.textMessages.length == 0)
					{
						callback(null,configuration.PCA_noTextMessagesAvailable,null);
					}
					else
					{/*Send the first text message*/
						callback(null,configuration.PCA_eventExistsAndOpen,doc.textMessages[0]);
					}
				}
			}
		});
		
	}
	


}

module.exports.EventsDAO = EventsDAO;
