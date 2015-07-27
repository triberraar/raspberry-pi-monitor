'use strict';

var fs = require('fs'),
    async = require('async');

var readFile = function(callback) {
    fs.readFile('/proc/meminfo', {encoding: 'binary'}, function(err, data) {
        if(err) {
            console.error('reading meminfo failed: ' + err);
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
            console.error('getMemory failed: ', err);
        } else {
            callback(result);
        }
    });
};
