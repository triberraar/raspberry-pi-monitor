'use strict';

angular.module('time', [
    'btford.socket-io',
    'ui.router',
    'util',
    'dashboard'
]).config(function ($stateProvider) {
    $stateProvider
        .state('time', {
            url:'/time',
            templateUrl: '/components/time/time.html'
        });
})
    .factory('timeDataService', function($timeout, socket, moment){
        var _refreshInterval;
        var _timeData = {};
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
            socket.emit('time');
        }

        socket.on('time', function(data){
            _timeData = data;
            if(!_paused) {
                _timeout = $timeout(requery, _refreshInterval);
            }
        });

        requery();

        return {
            setRefreshInterval : _setRefreshInterval,
            getData: function() { return _timeData;},
            pause: _pause,
            play: _play
        };
    })
    .controller('TimeController', function(moment, favoriteService, timeDataService){
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
            timeDataService.setRefreshInterval( _this.refreshInterval.value);
        }

        _this.refreshIntervalChanged = function() {
            timeDataService.setRefreshInterval(_this.refreshInterval.value);
        };

        _this.play = timeDataService.play;
        _this.pause = timeDataService.pause;

        _this.getTime = function() {
            if(timeDataService.getData() && timeDataService.getData().current) {
                return moment(timeDataService.getData().current).format('HH:mm:ss');
            } else {
                return '--:--:--';
            }
        };

        _this.getUptime = function() {
            if(timeDataService.getData() && timeDataService.getData().uptime) {
                return moment.duration(timeDataService.getData().uptime);
            }
        };

        _this.isFavorite = function() {
            return favoriteService.isFavorite({id: 'time', templateUrl: '/components/time/time.html'});
        };

        _this.toggleFavorite = function() {
            favoriteService.toggleFavorite({id: 'time', templateUrl: '/components/time/time.html'});
        };

        init();
    });