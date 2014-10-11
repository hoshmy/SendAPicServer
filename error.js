// Error handling middleware

exports.consoleErrorHandler = function(err, req, res, next) {
    "use strict";
    console.error(err.message);
    console.error(err.stack);
    res.status(500);
    res.render('error_template', { error: err });
}