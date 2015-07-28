'use strict';

angular.module('memory', [
    'btford.socket-io',
    'ui.router',
    'chart.js',
    'util',
    'dashboard'
]).config(function ($stateProvider) {
    $stateProvider
        .state('memory', {
            url:'/memory',
            templateUrl: '/components/memory/memory.html'
        })
        .state('memory.history', {
            url:'/history',
            templateUrl: '/components/memory/memory-history.html'
        });
})
    .factory('memoryDataService', function($timeout, socket, moment){
        var _refreshInterval;
        var _memoryData = [];
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
            if(!numberOfLatestEntries || _memoryData.length <= numberOfLatestEntries) {
                return _memoryData;
            }
            return _memoryData.slice(_memoryData.length - numberOfLatestEntries);
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
            socket.emit('memory');
        }

        socket.on('memory', function(data){
            _memoryData.push({time: moment(), data: data});
            if(!_paused) {
                _timeout = $timeout(requery, _refreshInterval);
            }
        });

        requery();

        return {
            setRefreshInterval : _setRefreshInterval,
            getLatest: function() { return _memoryData[_memoryData.length -1];},
            getData: _getData,
            pause: _pause,
            play: _play
        };
    })
    .controller('MemoryController', function($state, filesize, favoriteService, memoryDataService){
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
            memoryDataService.setRefreshInterval( _this.refreshInterval.value);
        }

        _this.refreshIntervalChanged = function() {
            memoryDataService.setRefreshInterval(_this.refreshInterval.value);
        };

        _this.getLatest = memoryDataService.getLatest;

        _this.play = memoryDataService.play;
        _this.pause = memoryDataService.pause;

        _this.navigateToHistoryShown = function() {
            return $state.$current.name !== 'memory.history';
        };

        _this.convertBytesToHumanReadable = function(value) {
            if(value) {
                return filesize(value * 1024);
            }
        };

        _this.getFreePercentage = function(total, free) {
            return ((free / total) * 100).toFixed(2);
        };

        _this.isFavorite = function() {
            return favoriteService.isFavorite({id: 'memory', templateUrl: '/components/memory/memory.html'});
        };

        _this.toggleFavorite = function() {
            favoriteService.toggleFavorite({id: 'memory', templateUrl: '/components/memory/memory.html'});
        };

        init();
    })
    .controller('MemoryHistoryController', function($scope, _, moment, filesize, memoryDataService) {
        var _this = this;

        function init() {
            _this.labels = [];
            _this.data = [
                []
            ];
            _this.series = ['total', 'used', 'free'];
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
            _this.labels = _.pluck(memoryDataService.getData(_this.numberOfEntries.value), 'time').map(function(value) {
                return value.format('DD/MM/YYYY, HH:mm:ss');
            });
            _this.data = [
                _.map(_.pluck(memoryDataService.getData(_this.numberOfEntries.value), 'data.total'), function(value) { return filesize(value * 1024, {output: 'object'}).value;}),
                _.map(_.pluck(memoryDataService.getData(_this.numberOfEntries.value), 'data.used'), function(value) { return filesize(value * 1024, {output: 'object'}).value;}),
                _.map(_.pluck(memoryDataService.getData(_this.numberOfEntries.value), 'data.free'), function(value) { return filesize(value * 1024, {output: 'object'}).value;})
            ];
        }

        $scope.$watch(memoryDataService.getData, function() {
            updateData();
        }, true);

        _this.getLabels = function() {
            return _this.labels;
        };

        _this.getData = function() {
            return _this.data;
        };

        _this.updateNumberOfEntries = function() {
            updateData();
        };

        init();
    });