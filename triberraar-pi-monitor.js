'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

var config = require('./config');

var cpuInfo = require('./app/controllers/cpu/cpu');
var memory = require('./app/controllers/memory/memory');
var network = require('./app/controllers/network/network');
var storage = require('./app/controllers/storage/storage');
var time = require('./app/controllers/time/time');

server.listen(config.port);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/views/index.html');
});

require('./app/routes/cpu')(app);
require('./app/routes/memory')(app);
require('./app/routes/network')(app);
require('./app/routes/storage')(app);
require('./app/routes/time')(app);

io.on('connection', function (socket) {
    socket.on('cpu', function() {
        cpuInfo.getCpuInfo(function(err, cpuInfo) {
            socket.emit('cpu', {error: err, content: cpuInfo});
        });
    });

    socket.on('memory', function() {
        memory.getMemory(function(err, memoryData) {
            if(!err) {
                socket.emit('memory', {error:err, content: memoryData});
            }
        });
    });

    socket.on('network', function() {
        network.getNetworkInfo(function(err, networkData) {
            socket.emit('network', {error:err, content: networkData});
        });
    });

    socket.on('storage', function() {
        storage.getStorageInfo(function(err, storageData) {
            socket.emit('storage', {error:err, content: storageData});
        });
    });
});

setInterval(function() {
    time.getTime(function(err, timeData) {
        io.emit('time', {error: err, content: timeData});
    });
}, 1000);