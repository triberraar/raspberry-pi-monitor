angular.module('test', [])
.controller('TestController', function(socket) {
        var _this = this;

        this.test = "test";
        this.counter = 0;

        // Emit ready event.
        socket.emit('client-talk', {message: 'content'});
        // Listen for the talk event.
        socket.on('server-respond', function(data) {
            console.log('response: ' + JSON.stringify(data));
        });

        socket.on('server-broad', function(data) {
            console.log('server-broad: ' + JSON.stringify(data));
            _this.message = data.message + " " + _this.counter;
            _this.counter ++;
        });

    });