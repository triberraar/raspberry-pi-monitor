'use strict';

angular.module('triberraarPiMonitorApp', [
    'btford.socket-io',
    'test'
]).
    factory('socket', function (socketFactory) {
        return socketFactory();
    });
