'use strict';

var fs = require('fs'),
    async = require('async'),
    moment = require('moment');

exports.getTime = function(callback) {
    fs.readFile('/proc/uptime', {encoding: 'binary'}, function(err, data) {
        if(err) {
            console.error('Executing uptime failed (are you running as sudo?): ' + JSON.stringify(err));
            callback({message: 'Executing uptime failed (are you running as sudo?)', error: err});
        } else {
            callback(undefined, {uptime: /(^\S+)/.exec(data)[0] * 1000, current: moment().toJSON()});
        }
    });
};
