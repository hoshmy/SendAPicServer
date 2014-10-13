var targetImagesDirectory = '/public/downloadedImages/';
var uri = 'mongodb://heroku_app28547922:q21abls64s91ubabuqipnps6f1@ds053218.mongolab.com:53218/heroku_app28547922';
var eventsCollection = 'SendAPicEvents';
var eventIdMultiplier = 100000;
var uploadsCollection = 'SendAPicUploads';
var downloadsCollection = 'SendAPicDownloads';
var defaultEventId = 33785;

exports.targetImagesDirectory = targetImagesDirectory;
exports.uri = uri;
exports.eventsCollection = eventsCollection;
exports.eventIdMultiplier = eventIdMultiplier;
exports.uploadsCollection = uploadsCollection;
exports.downloadsCollection = downloadsCollection;
exports.defaultEventId = defaultEventId;


/*Return Codes*/
/*CELL*/
var CELL_eventNotExists = 300;
var CELL_eventExists = 301;
var CELL_serverReceivedImage = 302;
var CELL_serverCouldntReceiveImage = 303;
var CELL_serverReceivedTextMessage = 304;
var CELL_serverCouldntReceiveTextMessage = 305;

exports.CELL_eventNotExists = CELL_eventNotExists;
exports.CELL_eventExists = CELL_eventExists;
exports.CELL_serverReceivedImage = CELL_serverReceivedImage;
exports.CELL_serverCouldntReceiveImage = CELL_serverCouldntReceiveImage;
exports.CELL_serverReceivedTextMessage = CELL_serverReceivedTextMessage;
exports.CELL_serverCouldntReceiveTextMessage = CELL_serverCouldntReceiveTextMessage;

/*PCA*/

var PCA_defaultCode = 200;
var PCA_eventNotExists = 500;
var PCA_eventExistsAndClose = 501;
var PCA_eventExistsAndOpen = 502;
var PCA_noImagesToDoenload = 503;
var PCA_generalCommandReceived = 504;
var PCA_noTextMessagesAvailable = 505;
var PCA_generalErrorInServer = 506;

exports.PCA_defaultCode = PCA_defaultCode;
exports.PCA_eventNotExists = PCA_eventNotExists;
exports.PCA_eventExistsAndClose = PCA_eventExistsAndClose;
exports.PCA_eventExistsAndOpen = PCA_eventExistsAndOpen;
exports.PCA_noImagesToDoenload = PCA_noImagesToDoenload;
exports.PCA_generalCommandReceived = PCA_generalCommandReceived;
exports.PCA_noTextMessagesAvailable = PCA_noTextMessagesAvailable;
exports.PCA_generalErrorInServer = PCA_generalErrorInServer;

