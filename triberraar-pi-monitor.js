'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

var cpuInfo = require('./app/controllers/cpu/cpu');
var memory = require('./app/controllers/memory/memory');
var network = require('./app/controllers/network/network');
var storage = require('./app/controllers/storage/storage');
var time = require('./app/controllers/time/time');

server.listen(7076);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/views/index.html');
});

require('./app/routes/cpu')(app, cpuInfo);
require('./app/routes/memory')(app, memory);
require('./app/routes/network')(app, network);
require('./app/routes/storage')(app, storage);
require('./app/routes/time')(app,time);

io.on('connection', function (socket) {
    socket.on('cpu', function() {
        cpuInfo.getCpuInfo(function(err, cpuInfo) {
            if(!err) {
                socket.emit('cpu', cpuInfo);
            }
        });
    });

    socket.on('memory', function() {
        memory.getMemory(function(err, memoryData) {
            if(!err) {
                socket.emit('memory', memoryData);
            }
        });
    });

    socket.on('network', function() {
        network.getNetworkInfo(function(err, networkData) {
            if(!err) {
                socket.emit('network', networkData);
            }
        });
    });

    socket.on('storage', function() {
        storage.getStorageInfo(function(err, storageData) {
            if(!err) {
                socket.emit('storage', storageData);
            }
        });
    });
});

setInterval(function() {
    time.getTime(function(err, timeData) {
        if(!err) {
            io.emit('time', timeData);
        }
    });
}, 1000);