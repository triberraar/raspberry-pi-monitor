'use strict';

module.exports = function(app, cpu) {
    app.get('/cpu', function(req, res) {
        cpu.getCpuInfo(function(cpuInfo) {
            res.json(cpuInfo);
        });
    });
};