'use strict';

var fs = require('fs'),
    async = require('async');

var readFile = function(callback) {
    fs.readFile('/sys/devices/virtual/thermal/thermal_zone0/temp', {encoding: 'binary'}, function(err, data) {
        if(err) {
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var processTemperature = function(data, callback) {
    callback(undefined, parseFloat(parseFloat(data / 1000).toFixed(2)));
};

exports.getTemperature = function(callback) {
    async.waterfall([
        readFile,
        processTemperature
    ], function(err, result){
        if(err) {
            callback({message: 'Reading temp failed (are you running as sudo?)', error: err});
        } else {
            callback(undefined, result);
        }
    });
};
