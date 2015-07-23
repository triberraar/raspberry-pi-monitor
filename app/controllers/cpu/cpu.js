'use strict';

var spawn = require('child_process').spawn;
var _ = require('lodash');
var async = require('async');
var process = require('./process');

var getCpuInfo = function(callback) {
    async.parallel(
        [process.getProcesses
            ], function (err, results) {
            if(err) {
                console.error('error' + err);
            } else {
                callback( {processes: results[0]});
            }
        }
    );
};

exports.getCpuInfo = getCpuInfo;

