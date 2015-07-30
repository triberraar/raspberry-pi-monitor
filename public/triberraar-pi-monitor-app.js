'use strict';

angular.module('triberraarPiMonitorApp', [
    'btford.socket-io',
    'ui.router',
    'chart.js',
    'ui.bootstrap',
    'ngStorage',
    'angular-growl',
    'util',
    'refreshInterval',
    'dashboard',
    'cpu',
    'memory',
    'network',
    'storage',
    'time'
])
    .config(function ($urlRouterProvider, growlProvider) {
        $urlRouterProvider.otherwise('/dashboard');
        growlProvider.globalTimeToLive(3000);

    })
    .run(function(timeDataService, cpuDataService, memoryDataService, networkDataService, storageDataService){
        timeDataService.init();
        cpuDataService.init();
        memoryDataService.init();
        networkDataService.init();
        storageDataService.init();

    });
