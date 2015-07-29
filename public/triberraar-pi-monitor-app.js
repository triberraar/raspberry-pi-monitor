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

    })
    .run(function(timeDataService, cpuDataService, memoryDataService, networkDataService, storageDataService){
        timeDataService.init();
        cpuDataService.init();
        memoryDataService.init();
        networkDataService.init();
        storageDataService.init();

    });
