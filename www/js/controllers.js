angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce) {

  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  // Form data for the login modal
  $scope.loginData = {};

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
  };
    
  $scope.showEventFacebook = function(url) {
      cordova.InAppBrowser.open(url, '_system', 'location=no');
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);

    // Simulate a login delay. Remove this and replace with your login
    // code if using a login system
    $timeout(function() {
      $scope.closeLogin();
    }, 1000);
  };
})

.controller('PlaylistsCtrl', function($scope) {
    var url = 'http://54.86.175.74:8080/events';
    var events = [];
    
    $.ajax({
       url: url,
       type: "GET",
       dataType: "json",
       success: function (data) {
            jQuery.each(data, function( key, value ) {
                if (value.image) {
                    events.push({ 
                        id: value._id,
                        title: value.name,
                        desc: value.description,
                        img_url: value.image.url,
                        facebook: value.url
                    });
                } else {
                    events.push({ 
                        id: value._id,
                        title: value.name,
                        desc: value.description,
                        facebook: value.url
                    });
                } 
            });
        }
    });
        
    $scope.playlists = events;
})

.controller('PlaylistCtrl', function($scope, $stateParams) {
    var url = 'http://54.86.175.74:8080/events/' + $stateParams.playlistId;
    
    $.ajax({
       url: url,
       type: "GET",
       dataType: "json",
       success: function (value) {
            $scope.myEvent = value;
       }
    });
});
