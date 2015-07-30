'use strict';

angular.module('storage', [
    'btford.socket-io',
    'ui.router',
    'chart.js',
    'angular-growl',
    'util',
    'dashboard'
]).config(function ($stateProvider) {
    $stateProvider
        .state('storage', {
            url:'/storage',
            templateUrl: '/components/storage/storage.html'
        });
})
    .factory('storageDataService', function($timeout, socket, growl){
        var _refreshInterval;
        var _storageData = {};
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
            socket.emit('storage');
        }

        socket.on('storage', function(data){
            if(data.error) {
                growl.error(data.error.message);
            } else {
                _storageData = data.content;
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
            getData: function() { return _storageData;},
            pause: _pause,
            play: _play,
            init: _init
        };
    })
    .controller('StorageController', function(sizeConverter, favoriteService, storageDataService){
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
            storageDataService.setRefreshInterval( _this.refreshInterval.value);
        }

        _this.refreshIntervalChanged = function() {
            storageDataService.setRefreshInterval(_this.refreshInterval.value);
        };

        _this.getData = storageDataService.getData;

        _this.play = storageDataService.play;
        _this.pause = storageDataService.pause;

        _this.convertBytesToHumanReadable = function(value) {
            if(value) {
                return sizeConverter.convert(value, 2);
            }
        };

        _this.getPercentage = function(total, free) {
            return (Math.floor((free / total) * 10000) / 100).toFixed(2);
        };

        _this.isFavorite = function() {
            return favoriteService.isFavorite({id: 'storage', templateUrl: '/components/storage/storage.html'});
        };

        _this.toggleFavorite = function() {
            favoriteService.toggleFavorite({id: 'storage', templateUrl: '/components/storage/storage.html'});
        };

        init();
    });