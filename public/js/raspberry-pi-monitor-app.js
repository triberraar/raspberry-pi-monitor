'use strict';

angular.module('raspberryPiMonitorApp', [
    'btford.socket-io',
    'test'
]).
    factory('socket', function (socketFactory) {
        return socketFactory();
    });
