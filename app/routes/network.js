'use strict';

module.exports = function(app, network) {
    app.get('/network', function(req, res) {
        network.getNetworkInfo(function(networkInfo) {
            res.json(networkInfo);
        });
    });
};