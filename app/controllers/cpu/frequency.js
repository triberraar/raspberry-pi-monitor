'use strict';

var fs = require('fs'),
    async = require('async');

var readFile = function(callback) {
    fs.readFile('/sys/devices/system/cpu/cpu0/cpufreq/cpuinfo_cur_freq', {encoding: 'binary'}, function(err, data) {
        if(err) {
            callback(err);
        } else {
            callback(undefined, data);
        }
    });
};

var processCurrentFrequency = function(data, callback) {
    callback(null, data / 1000);
};

exports.getCurrentFrequency = function(callback) {
    async.waterfall([
        readFile,
        processCurrentFrequency
    ], function(err, result){
        if(err) {
            callback({message: 'Reading cpuinfo_cur_freq failed (are you running as sudo?)', error: err});
        } else {
            callback(undefined, result);
        }
    });
};
