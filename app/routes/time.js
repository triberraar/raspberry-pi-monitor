'use strict';

var time = require('./../controllers/time/time');

module.exports = function(app) {
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