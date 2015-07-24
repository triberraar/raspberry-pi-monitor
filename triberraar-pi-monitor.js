'use strict';

var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

var cpuInfo = require('./app/controllers/cpu/cpu');

var sockets = [];

server.listen(7076);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/views/index.html');
});

io.on('connection', function (socket) {
    cpuInfo.getCpuInfo(function(cpuInfo) {
       socket.emit('cpu', cpuInfo);
    });
});

setInterval(function() {
    cpuInfo.getCpuInfo(function(cpuInfo) {
        io.emit('cpu', cpuInfo);
    });
}, 2500);
