var campuses = angular.module('starter.controllers.camp', []);

// allows for access of variable across controllers
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

// gets the campuses from server and passes information to view
campuses.controller('CampusCtrl', function($scope, $location, selectedCampuses) {
    var url = 'http://54.86.175.74:8080/campuses';
    
    $.ajax({
        url: url,
        type: "GET",
        dataType: "json",
        success: function (data) {
            // make object "checkable" for the view
            for (var i = 0; i < data.length; ++i) {
                data[i].checked = false;
            }
           
            // pass to the view
            $scope.choices = data;
        },
        error: function(xhr, text, err) {
            $location.path('/app/error');
        }
    });
    
    $scope.title = "Select Campuses";
    $scope.next = "Select Ministries";

    // function to be called when the user presses footer button
    // andvances to ministry page and sets the campuses the chose
    $scope.goToNext = function() {
        var campuses = [];

        // adds campuses user checked to list
        for (var i = 0; i < $scope.choices.length; ++i) {
            if ($scope.choices[i].checked) {
                campuses.push($scope.choices[i]);
            }
        }
        
        selectedCampuses.setCampuses(campuses);
        $location.path('/app/ministries');
    };
});