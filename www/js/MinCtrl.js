var min = angular.module('starter.controllers.min', []);

min.controller('MinCtrl', function($scope, $location, $ionicHistory, $ajax, $localStorage, selectedCampuses, constants) {
    var url = constants.BASE_SERVER_URL + 'ministries';
    
    //To get the campuses selected by the user on the previous page call: selectedCampuses.getCampuses()
    var success = function (data) {
        //makes the objects "checkable"
        for (var i = 0; i < data.length; ++i) {
            data[i].checked = false;
        }

        $scope.choices = data;
    };
    
    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };
    
    $ajax.get(url, 'json', success, err);
    
    $scope.title = "Select Ministries";
    $scope.next = "Start Using App!";
    
    $scope.goToNext = function() {
        // add campuses and ministries to phone local storage
        
        $location.path('/app');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
    };
});