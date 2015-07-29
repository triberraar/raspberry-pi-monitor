'use strict';

var fs = require('fs'),
    async = require('async');

var readFile = function(callback) {
    fs.readFile('/proc/meminfo', {encoding: 'binary'}, function(err, data) {
        if(err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var processMemory = function(data, callback) {
    var total = parseInt(/MemTotal:\s+(\d+)/.exec(data)[1]);
    var free = parseInt(/MemFree:\s+(\d+)/.exec(data)[1]);
    callback(null, {total: total, free: free, used: total - free});
};

exports.getMemory = function(callback) {
    async.waterfall([
        readFile,
        processMemory
    ], function(err, result){
        if(err) {
            console.error('Reading meminfo failed (are you running as sudo?): ', JSON.stringify(err));
            callback({message: 'Reading meminfo failed (are you running as sudo?)', error: err});
        } else {
            callback(undefined, result);
        }
    });
};
