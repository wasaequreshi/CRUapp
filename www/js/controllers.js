angular.module('starter.controllers', ['ngCordova', 'ionic'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $sce, $cordovaCalendar) {

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

  //When a button is clicked, this method is invoked
  //Takes in as a param the eventName, startDate, endDate, and location
  $scope.addEventToCalendar = function(eventName, startDate, endDate, location)
  {
       //Database has startDate as 2015-10-15T19:00:00.000Z
       //So I split at the "T" to seperate the date and time
       splitStartDateAndTime = startDate.split("T");
       //Splitting up the date into pieces
       splitStartDate = splitStartDateAndTime[0].split("-");
       //Splitting up the time into pieces
       splitStartTime = splitStartDateAndTime[1].split(":")
       
       //Same as before but now I am doing it for the end date
       splitEndDateAndTime = endDate.split("T");
       splitEndDate = splitEndDateAndTime[0].split("-");
       splitEndTime = splitEndDateAndTime[1].split(":")
       
       //Using ngcordova to create an event to their native calendar
       $cordovaCalendar.createEvent({
            title: eventName,
            location: location["street"],
            notes: 'This is a note',
            startDate: new Date(splitStartDate[0], Number(splitStartDate[1]) - 1,   
                                splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0, 0),
            endDate: new Date(splitEndDate[0], Number(splitEndDate[1] - 1), splitEndDate[2], 
                              splitEndTime[0], splitEndTime[1], 0, 0, 0)
        }).then(function (result) {
                console.log("Event created successfully");
                var alertPopup = $ionicPopup.alert({
                title: 'Event Added',
                template: eventName + ' has been added to your calendar :)'
            });

        }, function (err) {
            console.error("There was an error: " + err);
        });
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
