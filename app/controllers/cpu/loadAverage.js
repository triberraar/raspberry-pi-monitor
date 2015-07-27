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
    var splittedData = data.split(/\s/);
    callback(null, {'1min': splittedData[0], '5min': splittedData[1], '15min': splittedData[2]});
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
