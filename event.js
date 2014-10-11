var EventsDAO = require('./routes/events').EventsDAO
	,path = require('path')
	,utilities = require('./utilities');

function EventHandler(db){
	"use strict";

	var events = new EventsDAO(db);

	this.displayCreateNewEventPage = function(req,res,next){
		"use strict";
		res.sendfile('views/createNewEvent.html', {root: __dirname });
	};	

	this.createNewEvent = function(req, res, next) {
		"use strict";
		console.log('Creating new event via createNewEvent');
		
		var receivedEventDoc = req.body;
		console.log('receivedEventDoc: ' + JSON.stringify(receivedEventDoc));
		var newEventDoc = {};
		var action =  parseInt(receivedEventDoc["formChosenAction"]);//1 - newEvent
		
		if(action == 1)
		{
			newEventDoc["nameOfEvent"] = receivedEventDoc["nameOfEvent"];
			newEventDoc["firstNameOfClient"] = receivedEventDoc["firstNameOfClient"];
			newEventDoc["lastNameOfClient"] = receivedEventDoc["lastNameOfClient"];

			/*Prepare Start Date parameters*/
			var startYear = parseInt(receivedEventDoc["startDateYear"]);
			var startMonth = parseInt(receivedEventDoc["startDateMonth"]);
			var startDay = parseInt(receivedEventDoc["startDateDay"]);
			var startHours = parseInt(receivedEventDoc["startTimeHour"]);
			var startMinutes = parseInt(receivedEventDoc["startTimeMinutes"]);
			var startSeconds = parseInt(receivedEventDoc["startTimeSeconds"]);
			var startMilliSeconds = 0;
			if(receivedEventDoc["startTimeAmPm"] == "PM")
			{
				startHours += 12;
			}

			/*Prepare Stop Date parameters*/
			var stopYear = parseInt(receivedEventDoc["stopDateYear"]);
			var stopMonth = parseInt(receivedEventDoc["stopDateMonth"]);
			var stopDay = parseInt(receivedEventDoc["stopDateDay"]);
			var stopHours = parseInt(receivedEventDoc["stopTimeHour"]);
			var stopMinutes = parseInt(receivedEventDoc["stopTimeMinutes"]);
			var stopSeconds = parseInt(receivedEventDoc["stopTimeSeconds"]);
			var stopMilliSeconds = 0;
			if(receivedEventDoc["stopTimeAmPm"] == "PM")
			{
				stopHours += 12;
			}
			
			var startDate = new Date();
			startDate.setUTCSeconds( startSeconds );
			startDate.setUTCMinutes( startMinutes );
			startDate.setUTCHours( startHours );
			startDate.setUTCDate( startDay );
			startDate.setUTCMonth( startMonth-1 );
			startDate.setUTCFullYear( startYear );
			
			var stopDate = new Date();
			stopDate.setUTCSeconds( stopSeconds );
			stopDate.setUTCMinutes( stopMinutes );
			stopDate.setUTCHours( stopHours );
			stopDate.setUTCDate( stopDay );
			stopDate.setUTCMonth( stopMonth -1 );
			stopDate.setUTCFullYear( stopYear );
			
			newEventDoc["startDate"] = startDate; 
			newEventDoc["stopDate"] = stopDate;
			newEventDoc["newImageCounter"] = 0;
			newEventDoc["downloadImageIndex"] = 0;
			newEventDoc["numOfDownloads"] = 0;
			console.log('newEventDoc:\n' + JSON.stringify(newEventDoc));
			
			console.log('startDay: '+ newEventDoc["startDate"].getDate());
			console.log('stopDay: '+ newEventDoc["stopDate"].getDate());
			console.log('startMonth: '+ newEventDoc["startDate"].getMonth());
			console.log('stopMonth: '+ newEventDoc["stopDate"].getMonth());
			
			
			events.createNewEvent(newEventDoc,function(err,eventId){
				"use strict";
				if(err)
				{
					console.log('Error inserting new Event To Data Base: ' + err);
					res.send('Error inserting new Event To Data Base: ' + err);
				}
				else
				{
				    
				    console.log('New Event inserted to DB: ' + eventId );
					res.send('succedded through form_id, eventId: ' + eventId);
					
					/*create a folder for the event*/
					utilities.createFolderForEvent(eventId);
				}
			
			});
		}
	};
};

module.exports = EventHandler;
