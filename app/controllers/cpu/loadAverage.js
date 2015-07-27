'use strict';

var fs = require('fs'),
    async = require('async');

var readFile = function(callback) {
    fs.readFile('/proc/loadavg', {encoding: 'binary'}, function(err, data) {
       if(err) {
           console.error('reading loadavg failed: ' + err);
           callback(err);
       } else {
           callback(null, data);
       }
    });
};

var processLoadAvg = function(data, callback) {
    var processedData = /^(\S+)\s(\S+)\s(\S+)/.exec(data);
    callback(null, {'1min': processedData[1], '5min': processedData[2], '15min': processedData[3]});
};

exports.getLoadAverage = function(callback) {
    async.waterfall([
        readFile,
        processLoadAvg
    ], function(err, result){
        if(err) {
            console.error('getLoadAverage failed: ', err);
        } else {
            callback(null, result);
        }
    });
};
