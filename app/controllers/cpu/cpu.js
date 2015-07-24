'use strict';

var spawn = require('child_process').spawn;
var _ = require('lodash');
var async = require('async');
var loadAvg = require('./loadavg');

var getCpuInfo = function(callback) {
    async.parallel(
        [loadAvg.getLoadAvg
            ], function (err, results) {
            if(err) {
                console.error('error' + err);
            } else {
                callback( {loadAvg: results[0]});
            }
        }
    );
};

exports.getCpuInfo = getCpuInfo;

