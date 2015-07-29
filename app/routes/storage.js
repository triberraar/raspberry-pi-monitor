'use strict';

module.exports = function(app, storage) {
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