var campuses = angular.module('starter.controllers.camp', []);

campuses.service('selectedCampuses', function () {
    var campuses = [];

    return {
        getCampuses: function () {
            return campuses;
        },
        setCampuses: function(campusesList) {
            campuses = campusesList;
        }
    };
});

campuses.controller('CampusCtrl', function($scope, $location, selectedCampuses) {
    var url = 'http://54.86.175.74:8080/campuses';
    
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
    
    $scope.title = "Select Campuses";
    $scope.next = "Select Ministries";

    $scope.goToNext = function() {
        var campuses = [];
        console.log('During');

        for (var i = 0; i < $scope.choices.length; ++i) {
            if ($scope.choices[i].checked) {
                campuses.push($scope.choices[i]);
            }
        }
        
        selectedCampuses.setCampuses(campuses);
        $location.path('/app/ministries');
    };
});