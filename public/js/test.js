'use strict';

angular.module('test', [])
.controller('TestController', function(socket) {
        var _this = this;

        socket.on('cpu', function(data){
            console.log('cpu: ' + JSON.stringify(data));
        });
    });
