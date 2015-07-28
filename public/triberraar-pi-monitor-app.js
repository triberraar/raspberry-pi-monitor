'use strict';

angular.module('triberraarPiMonitorApp', [
    'btford.socket-io',
    'ui.router',
    'chart.js',
    'ui.bootstrap',
    'ngStorage',
    'util',
    'dashboard',
    'cpu',
    'memory',
    'network',
    'storage',
    'time'
])
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');

    });
