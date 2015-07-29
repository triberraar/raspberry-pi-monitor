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
        var _timeData = {};

        socket.on('time', function(data){
            _timeData = data;
        });

        return {
            getData: function() { return _timeData;},
            init: function() {}
        };
    })
    .controller('TimeController', function(moment, favoriteService, timeDataService){
        var _this = this;

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

    });