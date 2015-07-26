'use strict';

angular.module('util',[

])
    .factory('socket', function (socketFactory) {
        return socketFactory();
    })
    .factory('_', function($window){
        return $window._;
    })
    .factory('moment', function($window){
        return $window.moment;
    });