var min = angular.module('starter.controllers.min', []);

min.controller('MinCtrl', function($scope, $location, $ionicHistory, selectedCampuses) {
    var url = 'http://54.86.175.74:8080/ministries';
    
    //To get the campuses selected by the user on the previous page call: selectedCampuses.getCampuses()
    
    $.ajax({
       url: url,
       type: "GET",
       dataType: "json",
       success: function (data) {
           for (var i = 0; i < data.length; ++i) {
               data[i].checked = false;
           }
           
           $scope.choices = data;
       }
    });
    
    $scope.title = "Select Ministries";
    $scope.next = "Start Using App!";
    
    $scope.goToNext = function() {
        //TODO: write function that saves to phone storage
        $location.path('/app');
        $ionicHistory.nextViewOptions({
            disableAnimate: false,
            disableBack: true
        });
    };
});