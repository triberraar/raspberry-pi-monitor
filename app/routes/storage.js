'use strict';

module.exports = function(app, storage) {
    app.get('/storage', function(req, res) {
        storage.getStorageInfo(function(storageData) {
            res.json(storageData);
        });
    });
};