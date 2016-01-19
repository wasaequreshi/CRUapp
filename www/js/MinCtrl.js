var min = angular.module('starter.controllers.min', []);

min.controller('MinCtrl', function($scope, $location, $ionicHistory, selectedCampuses) {
    var url = 'http://54.86.175.74:8080/ministries';
    
    //To get the campuses selected by the user on the previous page call: selectedCampuses.getCampuses()
    
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            //makes the objects "checkable"
            for (var i = 0; i < data.length; ++i) {
                data[i].checked = false;
            }
           
            $scope.choices = data;
        },
        error: function(xhr, text, err) {
            //if there is an error (ie 404, 500, etc) redirect to the error page
            $location.path('/app/error');
        }
    });
    
    $scope.title = "Select Ministries";
    $scope.next = "Start Using App!";
    
    $scope.goToNext = function() {
        // add campuses and ministries to phone local storage
        cordova.file.applicationStorageDirectory.setItem();
        $location.path('/app');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
    };
});