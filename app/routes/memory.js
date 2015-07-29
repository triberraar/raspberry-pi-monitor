'use strict';

var memory = require('./../controllers/memory/memory');

module.exports = function(app) {
    app.get('/memory', function(req, res) {
        memory.getMemory(function(err, memoryData) {
            if(err) {
                res.status(500).json(err);
            } else {
                res.json(memoryData);
            }
        });
    });
};