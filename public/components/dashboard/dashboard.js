'use strict';

angular.module('dashboard', [
    'util',
    'ui.router'
]).config(function ($stateProvider) {
    $stateProvider
        .state('dashboard', {
            url:'/dashboard',
            templateUrl: '/components/dashboard/dashboard.html'
        });
})
    .factory('favoriteService', function(_) {
        var _favorites = [];

        var _addFavorite = function(fav) {
            _favorites.push(fav);
        };

        var _removeFavorite = function(fav) {
            _favorites = _.without(fav);
        };

        var _isFavorite = function(fav) {
            return (_.find(_favorites, fav) !== undefined);
        };

        var _toggleFavorite = function(fav) {
            if(_isFavorite(fav)) {
                _removeFavorite(fav);
            } else {
                _addFavorite(fav);
            }
        };

        return {
            toggleFavorite: _toggleFavorite,
            getFavorites: function() {
                return _favorites;
            },
            isFavorite: _isFavorite
        };
    })
    .controller('DashboardController', function(favoriteService) {
        var _this = this;

        _this.getFavorites = function() {
            return favoriteService.getFavorites();
        };
    });