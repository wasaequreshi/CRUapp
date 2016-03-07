/**
* This module is dedicated to creating Mock objects 
* for services that are created in the CRU application
*/
var cruMocks = angular.module('CruMocks',[]);

/**
* This local storage stub stores all values within a regular json object 
* We keep this out of our window's local storage to not mess with multiple
* Unit tests.
*/

cruMocks.factory('$localStorage', function(){
   var store = {};
   return {
      set: function(key, value) {
         store[key] = value;
      },
      get: function(key, defaultValue) {
         return store[key] || defaultValue;
      },
      setObject: function(key, value) {
          store[key] = JSON.stringify(value);
      },
      getObject: function(key) {
          return JSON.parse(store[key] || '{}');
      },
      removeObject: function(key) {
          delete store[key];
      }
   };
});


cruMocks.factory('selectedCampuses', function(){
  var campusesList = [];
  return {
      getCampuses: function() {
          return campusesList;
      },
      setCampuses: function(campusesList) {
          campusesList = campusesList; 
      },
      getCampusesObject: function() {
          return {};
      }
  };
});

/**
* This service is kept similar to its original counterpart because what
* it wraps, $http, is already mocked with angular-mocks
* To send back the data you want use $httpBackend
*/
cruMocks.factory('req', function($http){
      return {
        get: function(url, success, err) {
            // Simple GET request
            $http({
                method: 'GET',
                url: url
            }).then(success, err);
        },

        post: function(url, data, success, err) {
            $http.post(url, data).then(success, err);
        },

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
    };
})
