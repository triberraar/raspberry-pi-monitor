'use strict';

var fs = require('fs'),
    async = require('async');

var readFile = function(callback) {
    fs.readFile('/sys/devices/virtual/thermal/thermal_zone0/temp', {encoding: 'binary'}, function(err, data) {
        if(err) {
            console.error('reading temperature failed (are you running as sudo?): ' + JSON.stringify(err));
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var processTemperature = function(data, callback) {
    callback(null, parseFloat(parseFloat(data / 1000).toFixed(2)));
};

exports.getTemperature = function(callback) {
    async.waterfall([
        readFile,
        processTemperature
    ], function(err, result){
        if(err) {
            console.error('getTemperature failed (are you running as sudo?): ', JSON.stringify(err));
        } else {
            callback(null, result);
        }
    });
};
