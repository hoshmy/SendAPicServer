var targetImagesDirectory = '/public/downloadedImages/';
var uri = 'mongodb://heroku_app28547922:q21abls64s91ubabuqipnps6f1@ds053218.mongolab.com:53218/heroku_app28547922';
var eventsCollection = 'SendAPicEvents';
var eventIdMultiplier = 100000;
var uploadsCollection = 'SendAPicUploads';
var downloadsCollection = 'SendAPicDownloads';
var defaultEventId = 1;

exports.targetImagesDirectory = targetImagesDirectory;
exports.uri = uri;
exports.eventsCollection = eventsCollection;
exports.eventIdMultiplier = eventIdMultiplier;
exports.uploadsCollection = uploadsCollection;
exports.downloadsCollection = downloadsCollection;
exports.defaultEventId = defaultEventId;
