'use strict';

module.exports = function(app, network) {
    app.get('/network', function(req, res) {
        network.getNetworkInfo(function(err, networkInfo) {
            if(err) {
                res.status(500).json(err);
            } else {
                res.json(networkInfo);
            }
        });
    });
};