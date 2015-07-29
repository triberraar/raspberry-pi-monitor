'use strict';

angular.module('cpu', [
    'btford.socket-io',
    'ui.router',
    'chart.js',
    'angular-growl',
    'util',
    'dashboard'
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
    .factory('cpuDataService', function($timeout, socket, moment, growl){
        var _refreshInterval;
        var _cpuData = [];
        var _timeout;
        var _paused = false;

        var _setRefreshInterval = function(refreshInterval) {
            _refreshInterval = refreshInterval;
            if(_timeout) {
                $timeout.cancel(_timeout);
                if(!_paused) {
                    _timeout = $timeout(requery, _refreshInterval);
                }
            }
        };

        var _getData = function(numberOfLatestEntries) {
            if(!numberOfLatestEntries || _cpuData.length <= numberOfLatestEntries) {
                return _cpuData;
            }
            return _cpuData.slice(_cpuData.length - numberOfLatestEntries);
        };

        var _pause = function() {
            _paused = true;
            if(_timeout) {
                $timeout.cancel(_timeout);
            }
        };

        var _play = function() {
            _paused = false;
            requery();
        };

        function requery() {
            socket.emit('cpu');
        }

        socket.on('cpu', function(data){
            if(data.error) {
                growl.error(data.error.message);
            } else {
                _cpuData.push({time: moment(), data: data.content});
            }
            if(!_paused) {
                _timeout = $timeout(requery, _refreshInterval);
            }
        });

        var _init = function() {
            _refreshInterval = 5000;
            requery();
        };

        return {
            setRefreshInterval : _setRefreshInterval,
            getLatest: function() { return _cpuData[_cpuData.length -1];},
            getData: _getData,
            pause: _pause,
            play: _play,
            init: _init
        };
    })
    .controller('CpuController', function($state, cpuDataService, favoriteService){
        var _this = this;

        function init() {
            _this.refreshIntervals = [
                {caption: 'second', value: 1000},
                {caption: '5 seconds', value: 5000},
                {caption: '15 seconds', value: 15000},
                {caption: '30 seconds', value: 30000},
                {caption: 'minute', value: 60000},
                {caption: '5 minutes', value: 300000},
                {caption: '15 minutes', value: 900000}
            ];
            _this.refreshInterval=_this.refreshIntervals[1];
            cpuDataService.setRefreshInterval( _this.refreshInterval.value);
        }

        _this.refreshIntervalChanged = function() {
            cpuDataService.setRefreshInterval(_this.refreshInterval.value);
        };

        _this.getLatest = cpuDataService.getLatest;

        _this.play = cpuDataService.play;
        _this.pause = cpuDataService.pause;

        _this.navigateToHistoryShown = function() {
            return $state.$current.name !== 'cpu.history';
        };

        _this.isFavorite = function() {
            return favoriteService.isFavorite({id: 'cpu', templateUrl: '/components/cpu/cpu.html'});
        };

        _this.toggleFavorite = function() {
            favoriteService.toggleFavorite({id: 'cpu', templateUrl: '/components/cpu/cpu.html'});
        };

        _this.getTemperatureStatus = function() {
            if(!_this.getLatest() || !_this.getLatest().data || !_this.getLatest().data.temperature) {
                return;
            }
            if(_this.getLatest().data.temperature < 0) {
                return 'warning';
            } else if(_this.getLatest().data.temperature >=0 &&_this.getLatest().data.temperature < 50) {
                return 'success';
            } else if(_this.getLatest().data.temperature >= 50 && _this.getLatest().data.temperature <=75) {
                return 'warning';
            } else {
                return 'danger';
            }
        };

        init();
    })
    .controller('CpuHistoryController', function($scope, _, moment, cpuDataService) {
        var _this = this;

        function init() {
            _this.labels = [];
            _this.loadAvgData = [
                []
            ];
            _this.temperatureData = [
                []
            ];
            _this.loadAvgSeries = ['1min', '5min', '15min'];
            _this.temperatureSeries = ['temperature (°C)'];
            _this.options = {animation: false};

            _this.numberOfEntriesList = [
                {caption: '5', value: 5},
                {caption: '10', value: 10},
                {caption: '15', value: 15},
                {caption: 'all', value: undefined}
            ];
            _this.numberOfEntries=_this.numberOfEntriesList[1];
        }

        function updateData() {
            _this.labels = _.pluck(cpuDataService.getData(_this.numberOfEntries.value), 'time').map(function(value) {
                return value.format('DD/MM/YYYY, HH:mm:ss');
            });
            _this.loadAvgData = [
                _.pluck(cpuDataService.getData(_this.numberOfEntries.value), 'data.loadAvg.1min'),
                _.pluck(cpuDataService.getData(_this.numberOfEntries.value), 'data.loadAvg.5min'),
                _.pluck(cpuDataService.getData(_this.numberOfEntries.value), 'data.loadAvg.15min')];
            _this.temperatureData = [
                _.pluck(cpuDataService.getData(_this.numberOfEntries.value), 'data.temperature')];
        }

        $scope.$watch(cpuDataService.getData, function() {
            updateData();
        }, true);

        _this.updateNumberOfEntries = function() {
            updateData();
        };

        init();
    });