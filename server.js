var express = require('express');
var app = express();
var server = require('http').Server(app);
var io = require('socket.io')(server);
var _ = require('lodash');

var sockets = [];

server.listen(7076);

app.use(express.static('public'));

app.get('/', function (req, res) {
    res.sendFile(__dirname + '/app/views/index.html');
});

io.on('connection', function (socket) {
    sockets.push(socket);

    socket.on('client-talk', function (data) {
        console.log('client-talk: ' + JSON.stringify(data) );
        socket.emit('server-respond', { hello: 'world' });
    });
});

setInterval(function() {
    console.log('doing a socket');
    io.emit('server-broad', { message: 'broad' });
}, 1000);

