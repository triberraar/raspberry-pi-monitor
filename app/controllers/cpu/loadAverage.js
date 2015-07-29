'use strict';

var fs = require('fs'),
    async = require('async');

var readFile = function(callback) {
    fs.readFile('/proc/loadavg', {encoding: 'binary'}, function(err, data) {
       if(err) {
           callback(err);
       } else {
           callback(undefined, data);
       }
    });
};

var processLoadAvg = function(data, callback) {
    var processedData = /^(\S+)\s(\S+)\s(\S+)/.exec(data);
    callback(null, {'1min': parseFloat(processedData[1]), '5min': parseFloat(processedData[2]), '15min': parseFloat(processedData[3])});
};

exports.getLoadAverage = function(callback) {
    async.waterfall([
        readFile,
        processLoadAvg
    ], function(err, result){
        if(err) {
            callback({message: 'Reading loadavg failed (are you running as sudo?)', error: err});
        } else {
            callback(undefined, result);
        }
    });
};
