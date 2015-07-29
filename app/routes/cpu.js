'use strict';

module.exports = function(app, cpu) {
    app.get('/cpu', function(req, res) {
        cpu.getCpuInfo(function(err, cpuInfo) {
            if(err) {
                res.status(500).json(err);
            } else {
                res.json(cpuInfo);
            }
        });
    });
};