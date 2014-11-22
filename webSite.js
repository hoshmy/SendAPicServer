var configuration = require('./configuration')
    ,utilities = require('./utilities')

    
function webSite(db){
	"use strict";
	
	this.webSiteIndex = function(req,res,next){
		"use strict";
		res.sendFile('views/sendAPicWebSite.html', {root: __dirname });
	}
}

module.exports = webSite;