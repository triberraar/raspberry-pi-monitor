'use strict';

var fs = require('fs'),
    async = require('async');

var readRX = function(callback) {
    fs.readFile('/sys/class/net/eth0/statistics/rx_bytes', {encoding: 'binary'}, function(err, data) {
        if(err) {
            callback({message: 'Reading rx_bytes failed (are you running as sudo?)', error: err});
        } else {
            callback(undefined, parseInt(data));
        }
    });
};

var readTX = function(callback) {
    fs.readFile('/sys/class/net/eth0/statistics/tx_bytes', {encoding: 'binary'}, function(err, data) {
        if(err) {
            callback({message: 'Reading tx_bytes failed (are you running as sudo?)', error: err});
        } else {
            callback(undefined, parseInt(data));
        }
    });
};

exports.getNetworkInfo = function(callback) {
    async.parallel([
        readRX,
        readTX
    ], function(err, results){
        if(err) {
            console.error(err.message + ': ' + JSON.stringify(err.error));
            callback(err);
        } else {
            callback(undefined, {rx: parseFloat(results[0] / 1000), tx: parseFloat(results[1] / 1000)});
        }
    });
};
