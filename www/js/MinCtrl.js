var min = angular.module('starter.controllers.min', []);

min.controller('MinCtrl', ['$scope', '$location', '$ionicHistory', 'req', '$localStorage','selectedCampuses', 'constants', function($scope, $location, $ionicHistory, req, $localStorage, selectedCampuses, constants) {
    var url = req.buildQueryUrl(constants.BASE_SERVER_URL + 'ministries','campuses', selectedCampuses.getCampuses());
    
    var success = function (data) {
        //makes the objects "checkable"
        for (var i = 0; i < data.data.length; ++i) {
            data.data[i].checked = false;
        }
        $scope.ministries = data.data;
    };
    
    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    req.get(url, success, err);

    $scope.title = "Select Ministries";
    $scope.next = "Start Using App!";
    
    $scope.goToNext = function() {
        var mins = [];

        // adds ministries user checked to list
        for (var i = 0; i < $scope.ministries.length; ++i) {
            if ($scope.ministries[i].checked) {
                mins.push($scope.ministries[i]);
            }
        }
        
        $localStorage.setObject(constants.CAMPUSES_CONFIG, {
            campuses : selectedCampuses.getCampuses(),
            ministries: mins
        });
        
        $location.path('/app');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
    };
    
    $scope.currentHeader = "";
    $scope.campuses = selectedCampuses.getCampusesObject();
    
    $scope.setupHeader = function(ministry){
        
        showHeader = $scope.currentHeader !== $scope.campuses[ministry.campuses[0]];
        $scope.currentHeader = $scope.campuses[ministry.campuses[0]];
        console.log("header" + $scope.currentHeader + " " + showHeader);
        return showHeader;
    }
}]);