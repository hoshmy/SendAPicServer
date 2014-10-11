var utilities = require('../utilities')
  , configuration = require('../configuration');

function UploadsDAO(db) {
    "use strict";

    /* If this constructor is called without the "new" operator, "this" points
     * to the global object. Log a warning and call it correctly. */
    if (false === (this instanceof UploadsDAO)) {
        console.log('Warning: UploadDAO constructor called without "new" operator');
        return new UploadsDAO(db);
    }

    var uploads = db.collection(configuration.uploadsCollection);
}

module.exports.UploadsDAO = UploadsDAO;