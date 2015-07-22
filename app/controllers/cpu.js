'use strict';

var spawn = require('child_process').spawn;
var _ = require('lodash');
var async = require('async');

var queryCpuInfo = function(callback) {
    var ps = spawn('ps', ['-eo %cpu,args']),
        buffer = '';

    ps.stdout.on('data', function (data) {
        buffer = buffer + data;
    });

    ps.stderr.on('data', function (data) {
        console.error('stderr: ' + data);
        callback(data);
    });

    ps.on('close', function (code) {
        callback(null, buffer);
    });
};

var processCpuInfo = function(cpuInfoBlob, callback) {
    var cpuInfos = cpuInfoBlob.trim().split('\n');
    cpuInfos.splice(0,1);
    var processedCpuInfo = [];
    _.forEach(cpuInfos, function(cpuInfo) {
        var splitted = cpuInfo.trim().split(/[\s,]+/);
        processedCpuInfo.push({cpu: parseFloat(splitted[0]), command: splitted[1]});
    });
    callback(null, processedCpuInfo);
};

var getCpuInfo = function(callback) {
    async.waterfall(
        [queryCpuInfo,
            processCpuInfo,
            function(processedCpuInfo, callback) {
                processedCpuInfo = _.sortBy(processedCpuInfo, 'cpu').reverse();
                callback(null, processedCpuInfo);
            },
            function(cpuInfo, callback) {
                callback(null, cpuInfo.splice(0, 5));
            }], function (err, result) {
            if(err) {
                console.error('error' + err);
            } else {
                callback(result);
            }
        }
    );
};

exports.getCpuInfo = getCpuInfo;

