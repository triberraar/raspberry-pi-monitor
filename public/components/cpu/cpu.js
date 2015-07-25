'use strict';

angular.module('cpu', [
    'btford.socket-io',
    'ui.router'
]).config(function ($stateProvider) {
    $stateProvider
        .state('cpu', {
            url:'/cpu',
            templateUrl: '/components/cpu/cpu.html'
        })
        .state('cpu.history', {
            url:'/history',
            templateUrl: '/components/cpu/cpu-history.html'
        });
})
    .controller('CpuController', function($interval, socket){
        var _this = this;
        var interval;

        function init() {
            _this.refresIntervals = [
                {caption: "second", value: 1000},
                {caption: "5 seconds", value: 5000},
                {caption: "15 seconds", value: 15000},
                {caption: "30 seconds", value: 30000},
                {caption: "minute", value: 60000},
                {caption: "5 minutes", value: 300000},
                {caption: "15 minutes", value: 900000}
            ];
            _this.refreshInterval=_this.refresIntervals[1];
            interval = $interval(requery, _this.refreshInterval.value);
            requery();
        }

        _this.refreshIntervalChanged = function() {
            $interval.cancel(interval);
            interval = $interval(requery, _this.refreshInterval.value);
        };

        function requery() {
            socket.emit("cpu")
        }

        socket.on('cpu', function(data){
            console.log('cpu: ' + JSON.stringify(data));
            _this.cpuInfo = data;
        });

        init();
    });