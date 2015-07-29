'use strict';

var cpu = require('./../controllers/cpu/cpu');

module.exports = function(app) {
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