'use strict';

module.exports = function(app, cpuInfo) {
    app.get('/cpu', function(req, res) {
        cpuInfo.getCpuInfo(function(cpuInfo) {
            res.json(cpuInfo);
        });
    });
};