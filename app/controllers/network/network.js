'use strict';

var fs = require('fs'),
    async = require('async');

var readRX = function(callback) {
    fs.readFile('/sys/class/net/eth0/statistics/rx_bytes', {encoding: 'binary'}, function(err, data) {
        if(err) {
            console.error('reading rx failed: ' + err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

var readTX = function(callback) {
    fs.readFile('/sys/class/net/eth0/statistics/tx_bytes', {encoding: 'binary'}, function(err, data) {
        if(err) {
            console.error('reading tx failed: ' + err);
            callback(err);
        } else {
            callback(null, data);
        }
    });
};

exports.getNetworkInfo = function(callback) {
    async.parallel([
        readRX,
        readTX
    ], function(err, results){
        if(err) {
            console.error('getMemory failed: ', err);
        } else {
            callback({rx: results[0], tx: results[1]});
        }
    });
};
