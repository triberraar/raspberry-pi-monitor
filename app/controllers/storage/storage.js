'use strict';

var fs = require('fs'),
    async = require('async'),
    spawn = require('child_process').spawn;

var df = function(callback) {
    var ps = spawn('df', ['/']),
        buffer = '';

    ps.stdout.on('data', function (data) {
        buffer = buffer + data;
    });

    ps.stderr.on('data', function (data) {
        callback(data);
    });

    ps.on('close', function (code) {
        callback(null, buffer);
    });
};

var processDf = function(data, callback) {
    data = data.trim();
    var total = /\S+\s+(\d+).*\/$/.exec(data)[1];
    var used = /\S+\s+\d+\s+(\d+).*\/$/.exec(data)[1];
    var available = /\S+\s+\d+\s+\d+\s+(\d+).*\/$/.exec(data)[1];
    var reserved = total - used - available;
    callback(null, {total : parseInt(total), used: parseInt(used), free: parseInt(available), reserved: parseInt(reserved)});
};

exports.getStorageInfo = function(callback) {
    async.waterfall([
        df,
        processDf
    ], function(err, result){
        if(err) {
            console.error('getStorageInfo failed (are you running as sudo?): ', JSON.stringify(err));
        } else {
            callback(result);
        }
    });
};
