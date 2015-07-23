'use strict';

var spawn = require('child_process').spawn;
var _ = require('lodash');
var async = require('async');

var queryProcesses = function(callback) {
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

var processProcesses = function(processesBlob, callback) {
    var processes = processesBlob.trim().split('\n');
    processes.splice(0,1);

    console.log(processesBlob);
     var result = _.sortBy(_.map(processes, function(process){
         console.log(process);
        var splitted = process.trim().split(/[\s,]+/);
        return {cpu: parseFloat(splitted[0]), command: splitted[1]};
    }), 'cpu')
        .reverse()
        .splice(0, 10);

    callback(null, result);
};

exports.getProcesses = function(callback) {
    async.waterfall(
        [queryProcesses,
            processProcesses
        ], function (err, result) {
            if(err) {
                console.error('error' + err);
            } else {
                callback(null, result);
            }
        }
    );
};