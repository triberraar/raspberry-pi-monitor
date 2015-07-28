'use strict';

module.exports = function(app, time) {
    app.get('/time', function(req, res) {
        time.getTime(function(timeInfo) {
            res.json(timeInfo);
        });
    });
};