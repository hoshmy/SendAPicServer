var fs = require('fs');
var configuration = require('./configuration');

module.exports = {
	initFileSystem : function(){
		if (false === fs.existsSync('.' + configuration.targetImagesDirectory)) 
		{
			fs.mkdirSync('.' + configuration.targetImagesDirectory);
		}
		
		var defaultEventFolder = '.' + configuration.targetImagesDirectory+ '/' +configuration.defaultEventId;
		if (false === fs.existsSync(defaultEventFolder)) 
		{
			fs.mkdirSync(defaultEventFolder);
		}
	},
	
	createFolderForEvent: function(_eventId){
		var folderName = '.' + configuration.targetImagesDirectory+ '/' + _eventId;
		fs.exists(folderName,function(isExists){
			if(false == isExists)
			{
				fs.mkdir(folderName,function(err){
					if(err)
					{
						console.log('error while creating folder to event #' + _eventId);
					}
				});
			}
		}); 
	},

	deleteAllImages :function(){
		var directory = '.' + configuration.targetImagesDirectory;
		fs.readdirSync(directory).forEach(function(fileName) {
			var file = directory + fileName;
	        console.log('deleting:' + file);
            fs.unlinkSync(file);
	    });
	}

}