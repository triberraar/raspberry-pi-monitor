'use strict';

angular.module('cpu', [
    'util',
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
    .factory('cpuDataService', function($timeout, socket, moment){
        var _refreshInterval;
        var _cpuData = [];
        var timeout;

        var _setRefreshInterval = function(refreshInterval) {
            _refreshInterval = refreshInterval;
            if(timeout) {
                $timeout.cancel(timeout);
                timeout = $timeout(requery, _refreshInterval);
            }
        };

        function requery() {
            socket.emit("cpu")
        }

        socket.on('cpu', function(data){
            console.log('cpu: ' + JSON.stringify(data));
            _cpuData.push({time: moment(), data: data});
            if(_cpuData.length > 5) {
                _cpuData = _cpuData.slice(1, 6);
            }
            timeout = $timeout(requery, _refreshInterval);
        });

        requery();

        return {
            setRefreshInterval : _setRefreshInterval,
            getRefreshInterval: function() { return _refreshInterval;},
            getLatest: function() { return _cpuData[_cpuData.length -1];},
            getData: function() { return _cpuData; }
        }
    })
    .controller('CpuController', function($state, cpuDataService){
        var _this = this;

        function init() {
            _this.refreshIntervals = [
                {caption: "second", value: 1000},
                {caption: "5 seconds", value: 5000},
                {caption: "15 seconds", value: 15000},
                {caption: "30 seconds", value: 30000},
                {caption: "minute", value: 60000},
                {caption: "5 minutes", value: 300000},
                {caption: "15 minutes", value: 900000}
            ];
            _this.refreshInterval=_this.refreshIntervals[1];
            cpuDataService.setRefreshInterval( _this.refreshInterval.value);

        }

        _this.refreshIntervalChanged = function() {
            cpuDataService.setRefreshInterval(_this.refreshInterval.value);
        };

        _this.getLatest = cpuDataService.getLatest;

        _this.navigateToHistoryShown = function() {
            return $state.$current.name != 'cpu.history';
        };

        init();
    })
    .controller('CpuHistoryController', function($scope, _, moment, cpuDataService) {
        var _this = this;

        $scope.$watch(cpuDataService.getData, function(value) {
            console.log('changed');
            _this.labels = _.pluck(cpuDataService.getData(), 'time').map(function(value) {
                return value.format("DD/MM/YYYY, HH:mm:ss")
            });
            _this.data = [
                _.pluck(cpuDataService.getData(), 'data.loadAvg.1min'),
                _.pluck(cpuDataService.getData(), 'data.loadAvg.5min'),
                _.pluck(cpuDataService.getData(), 'data.loadAvg.15min')];
        }, true);

        _this.labels = [];
        _this.data = [
            []
        ];
        _this.onClick = function (points, evt) {
            console.log(points, evt);
        };

        _this.getLabels = function() {
            return _this.labels;
        };

        _this.getData = function() {
            return _this.data;
        };

        _this.series = ['1min', '5min', '15min'];

        _this.options = {animation: false};
    });