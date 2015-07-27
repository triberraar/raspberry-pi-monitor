'use strict';

module.exports = function(app, memory) {
    app.get('/memory', function(req, res) {
        memory.getMemory(function(memoryData) {
            res.json(memoryData);
        });
    });
};