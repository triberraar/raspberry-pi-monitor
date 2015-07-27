'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

var cpuInfo = require('./app/controllers/cpu/cpu');
var memory = require('./app/controllers/memory/memory');

server.listen(7076);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/views/index.html');
});

require('./app/routes/cpu')(app, cpuInfo);
require('./app/routes/memory')(app, memory);

io.on('connection', function (socket) {
    socket.on('cpu', function() {
        cpuInfo.getCpuInfo(function(cpuInfo) {
            socket.emit('cpu', cpuInfo);
        });
    });

    socket.on('memory', function() {
        memory.getMemory(function(memoryData) {
            socket.emit('memory', memoryData);
        })
    })
});