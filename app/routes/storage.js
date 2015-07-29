'use strict';

var storage = require('./../controllers/storage/storage');

module.exports = function(app) {
    app.get('/storage', function(req, res) {
        storage.getStorageInfo(function(err, storageData) {
            if(err) {
                res.status(500).json(err);
            } else {
                res.json(
                    storageData);
            }
        });
    });
};