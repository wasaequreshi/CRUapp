var missionCtrl = angular.module('MissionCtrl', []);

missionCtrl.controller('MissionsCtrl', function($scope, $location, req, constants, convenience) {
    var url = constants.BASE_SERVER_URL + 'summermission/list';
    var missions = [];

    // on success add all the ministries to the ministries list
    var success = function(data) {
        data.data.forEach(function(value) {
            var val = value;
            var locale = 'en-us';

            // make the date human readeable
            val.startDate = convenience.formatDate(new Date(value.startDate), false);

            // if there is not an image, set the image to the placeholder
            if (!value.image) {
                val.image = {url: constants.PLACEHOLDER_IMAGE};
            }

            missions.push(val);
        });
    };

    // when there is an error, print it out and show the error page in app
    var err = function(response) {
        console.error('Error getting summer missions' + response);
        $location.path('/app/error');
    };

    // send the request to the server
    req.get(url, success, err);

    // add the missions to the scope so they can be accessed in the view
    $scope.missions = missions;
    
    // navigate to the specific image page when a mission is clicked
    $scope.goToMission = function(id) {
        $location.path('/app/missions/' + id);
    };
})

missionCtrl.controller('MissionCtrl', function($scope, $stateParams, $cordovaInAppBrowser, req, constants, convenience) {
    var url = constants.BASE_SERVER_URL + 'summermission/' + $stateParams.missionId;
    var success = function(value) {
        var val = value.data;

        // format the dates to be human readable
        val.startDate = convenience.formatDate(new Date(val.startDate), false);
        val.endDate = convenience.formatDate(new Date(val.endDate), false);

        if (!value.image) {
            val.image = {url: constants.PLACEHOLDER_IMAGE};
        }

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