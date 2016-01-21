var utils = angular.module('starter.controllers.utils', []);

// sets up easy access key value store for local storage on device
utils.factory('$localStorage', ['$window', function($window) {
    return {
        set: function(key, value) {
            $window.localStorage[key] = value;
        },
        get: function(key, defaultValue) {
            return $window.localStorage[key] || defaultValue;
        },
        setObject: function(key, value) {
            $window.localStorage[key] = JSON.stringify(value);
        },
        getObject: function(key) {
            return JSON.parse($window.localStorage[key] || '{}');
        }
    }
}]);

utils.factory('$ajax', ['$window', function($window) {
    return {
        get: function(url, data, success, err) {
            $.ajax({
                url: url,
                type: "GET",
                dataType: data,
                success: success,
                error: err
            });
        },
        post: function(url, data, success, err) {
            $.ajax({
                url: url,
                type: "POST",
                dataType: data,
                success: success,
                error: err
            });
        }
    }
}]);

// creates a list of constants that are accessible anywhere
utils.constant('constants', {'BASE_SERVER_URL':'http://54.86.175.74:8080/',
                            'CAMPUSES_CONFIG': 'campuses'
                            });