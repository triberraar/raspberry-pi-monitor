'use strict';

angular.module('network', [
    'btford.socket-io',
    'ui.router',
    'chart.js',
    'angular-growl',
    'util',
    'dashboard'
]).config(function ($stateProvider) {
    $stateProvider
        .state('network', {
            url:'/network',
            templateUrl: '/components/network/network.html'
        })
        .state('network.history', {
            url:'/history',
            templateUrl: '/components/network/network-history.html'
        });
})
    .factory('networkDataService', function($timeout, socket, moment, growl){
        var _refreshInterval;
        var _networkData = [];
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
            if(!numberOfLatestEntries || _networkData.length <= numberOfLatestEntries) {
                return _networkData;
            }
            return _networkData.slice(_networkData.length - numberOfLatestEntries);
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
            socket.emit('network');
        }

        socket.on('network', function(data) {
            if(data.error) {
                growl.error(data.error.message);
            } else {
                _networkData.push({time: moment(), data: data.content});
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
            getLatest: function() { return _networkData[_networkData.length -1];},
            getData: _getData,
            pause: _pause,
            play: _play,
            init: _init
        };
    })
    .controller('NetworkController', function($state, filesize, moment, favoriteService, networkDataService){
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
            networkDataService.setRefreshInterval( _this.refreshInterval.value);
        }

        _this.refreshIntervalChanged = function() {
            networkDataService.setRefreshInterval(_this.refreshInterval.value);
        };

        _this.getLatest = networkDataService.getLatest;

        _this.play = networkDataService.play;
        _this.pause = networkDataService.pause;

        _this.navigateToHistoryShown = function() {
            return $state.$current.name !== 'network.history';
        };

        _this.convertBytesToHumanReadable = function(value) {
            if(value) {
                return filesize(value);
            }
        };

        _this.calculateSpeedRX = function() {
            var lastDatas = networkDataService.getData(2);

            if(lastDatas.length !== 2) {
                return '--';
            }

            var previousBytes = lastDatas[0].data.rx;
            var currentBytes = lastDatas[1].data.rx;

            var durationInSeconds = moment.duration(lastDatas[1].time.diff(lastDatas[0].time)).asSeconds();

            return filesize((currentBytes - previousBytes) / durationInSeconds);
        };

        this.calculateSpeedTX = function() {
            var lastDatas = networkDataService.getData(2);

            if(lastDatas.length !== 2) {
                return '--';
            }

            var previousBytes = lastDatas[0].data.tx;
            var currentBytes = lastDatas[1].data.tx;

            var durationInSeconds = moment.duration(lastDatas[1].time.diff(lastDatas[0].time)).asSeconds();

            return filesize((currentBytes - previousBytes) / durationInSeconds);
        };

        _this.isFavorite = function() {
            return favoriteService.isFavorite({id: 'network', templateUrl: '/components/network/network.html'});
        };

        _this.toggleFavorite = function() {
            favoriteService.toggleFavorite({id: 'network', templateUrl: '/components/network/network.html'});
        };

        init();
    })
    .controller('NetworkHistoryController', function($scope, _, moment, filesize, networkDataService) {
        var _this = this;

        function init() {
            _this.labels = [];
            _this.data = [
                [],[]
            ];
            _this.series = ['RX (kB/s)', 'TX (kB/s)'];
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
            _this.labels = _.pluck(networkDataService.getData(_this.numberOfEntries.value + 1), 'time').map(function(value) {
                return value.format('DD/MM/YYYY, HH:mm:ss');
            });

            _this.labels = _this.labels.slice(1);

            var tempData = [
                networkDataService.getData(_this.numberOfEntries.value + 1),
                networkDataService.getData(_this.numberOfEntries.value + 1)];

            _this.data = [
                [],[]
            ];
            for(var  i=1; i< tempData[0].length; i++) {
                _this.data[0].push(calculateSpeedRX(tempData[0][i-1], tempData[0][i]));
                _this.data[1].push(calculateSpeedTX(tempData[1][i-1], tempData[1][i]));
            }

            if (_this.labels.length === 0) {
                _this.labels = [''];
                _this.data = [
                    [''],['']
                ];
            }
        }

        function calculateSpeedRX(previous, current) {
            if(!previous || !current) {
                return;
            }

            var durationInSeconds = moment.duration(current.time.diff(previous.time)).asSeconds();

            return filesize((current.data.rx - previous.data.rx) / durationInSeconds, {exponent: 1,output: 'object'}).value;
        }

        function calculateSpeedTX(previous, current) {
            if(!previous || !current) {
                return;
            }

            var durationInSeconds = moment.duration(current.time.diff(previous.time)).asSeconds();

            return filesize((current.data.tx - previous.data.tx) / durationInSeconds, {exponent: 1,output: 'object'}).value;
        }

        $scope.$watch(networkDataService.getData, function() {
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