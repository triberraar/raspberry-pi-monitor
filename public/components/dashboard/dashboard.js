'use strict';

angular.module('dashboard', [
    'btford.socket-io',
    'ui.router'
]).config(function ($stateProvider) {
    $stateProvider
        .state('dashboard', {
            url:'/dashboard',
            templateUrl: '/components/dashboard/dashboard.html'
        });
});