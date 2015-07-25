'use strict';

angular.module('triberraarPiMonitorApp', [
    'btford.socket-io',
    'ui.router',
    'dashboard',
    'cpu',
    'test'
]).
    factory('socket', function (socketFactory) {
        return socketFactory();
    })
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');

    });
