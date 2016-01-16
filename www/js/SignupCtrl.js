var signup = angular.module('starter.controllers.signup', [])

signup.controller('SignupCtrl', function($scope) {
    var url = 'http://54.86.175.74:8080/campuses';
    var campuses = [];
    
    $.ajax({
       url: url,
       type: "GET",
       dataType: "json",
       success: function (data) {
           $scope.campuses = data;
       }
    });
});