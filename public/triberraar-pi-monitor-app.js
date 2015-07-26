'use strict';

angular.module('triberraarPiMonitorApp', [
    'btford.socket-io',
    'ui.router',
    'chart.js',
    'ui.bootstrap',
    'util',
    'dashboard',
    'cpu',
    'memory'
])
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');

    });
