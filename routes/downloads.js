var utilities = require('../utilities')
  , configuration = require('../configuration');

function DownloadsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof DownloadsDAO)) {
        console.log('Warning: DownloadsDAO constructor called without "new" operator');
        return new DownloadsDAO(db);
    }

    var uploads = db.collection(configuration.downloadsCollection);
}

module.exports.DownloadsDAO = DownloadsDAO;