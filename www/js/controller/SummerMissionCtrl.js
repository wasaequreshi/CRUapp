var missionCtrl = angular.module('MissionCtrl', []);

missionCtrl.controller('MissionsCtrl', function($scope,$rootScope,$timeout, $location, req, constants) {
    var url = constants.BASE_SERVER_URL + 'summermission/list';
    var missions = [];
    var success = function(data) {
        jQuery.each(data.data, function(key, value) {
            var val = value;
            var locale = 'en-us';

            var eventDate = new Date(value.startDate);
            val.startDate = eventDate.toLocaleDateString(locale, {weekday: 'long'}) + ' - ' +
                eventDate.toLocaleDateString(locale, {month: 'long'}) + ' ' +
                eventDate.getDate() + ', ' + eventDate.getFullYear();

            if (!value.image) {
                val.image = {url: 'img/cru-logo.jpg'};
            }

            missions.push(val);
        });
    };

    var err = function(response) {
        $location.path('/app/error');
    };

    req.get(url, success, err);
    $scope.missions = missions;
    $scope.goToMission = function(id) {
        $location.path('/app/missions/' + id);
    };
})

missionCtrl.controller('MissionCtrl', function($scope, $stateParams, $cordovaInAppBrowser, req, constants) {

    var url = constants.BASE_SERVER_URL + 'summermission/' + $stateParams.missionId;
    var success = function(value) {
        var val = value.data;
        var locale = 'en-us';

        // Make dates human readable
        var eventDate = new Date(val.startDate);
        var endDate = new Date(val.endDate);
        val.startDate = eventDate.toLocaleDateString(locale, {month: 'long'}) + ' ' +
            eventDate.getDate() + ', ' + eventDate.getFullYear();
        val.endDate = endDate.toLocaleDateString(locale, {month: 'long'}) + ' ' +
            endDate.getDate() + ', ' + endDate.getFullYear();

        $scope.mySummerMission = val;
    };

    var err = function(response) {
        $location.path('/app/error');
    };

    
        
    $scope.showOnline = function(url) {
        $cordovaInAppBrowser.open(url, '_system');  
    };
    
    req.get(url, success, err);
});