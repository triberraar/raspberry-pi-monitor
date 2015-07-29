'use strict';

module.exports = function(app, time) {
    app.get('/time', function(req, res) {
        time.getTime(function(err, timeInfo) {
            if(err) {
                res.status(500).json(err);
            } else {
                res.json(timeInfo);
            }
        });
    });
};