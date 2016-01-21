var utils = angular.module('starter.controllers.utils', []);

// creates a list of constants that are accessible anywhere
utils.constant('constants', {
    'BASE_SERVER_URL' : 'http://54.86.175.74:8080/',
    'CAMPUSES_CONFIG' : 'campuses'
});

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


// utitity methods for calling basic ajax
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
        },
        /**
         * url - the url you want to add a query to
         * varName - the name of the variable to be passed to the query
         * values - the array of values to be passed in the query
         */
        buildQueryUrl: function(url, varName, values) {
            varName += '[]=';
            
            if (values.length > 0) {
                url += '?' + varName + '' + values[0]._id;
                for (var i = 1; i < values.length; ++i) {
                    url += '&' + varName + '' + values[i]._id; 
                }
            }
            
            return url;
        }
    }
}]);