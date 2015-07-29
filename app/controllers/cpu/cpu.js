'use strict';

var _ = require('lodash'),
    async = require('async'),
    loadAverage = require('./loadAverage'),
    frequency = require('./frequency'),
    temperature = require('./temperature');

var getCpuInfo = function(callback) {
    async.parallel(
        [
            loadAverage.getLoadAverage,
            frequency.getCurrentFrequency,
            temperature.getTemperature
        ], function (err, results) {
            if(err) {
                console.error(err.message + ': ' + JSON.stringify(err.error));
                callback(err);
            } else {
                callback(undefined, {loadAvg: results[0], frequency: results[1], temperature: results[2]});
            }
        }
    );
};

exports.getCpuInfo = getCpuInfo;