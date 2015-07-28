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
    'storage'
])
    .config(function ($urlRouterProvider) {
        $urlRouterProvider.otherwise('/dashboard');

    });
