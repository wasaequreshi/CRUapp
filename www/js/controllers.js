angular.module('starter.controllers', ['starter.controllers.camp', 'starter.controllers.min', 'ngCordova', 'ionic','PushModule'])

.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaCalendar, $ionicPopup, $localStorage) {

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

  //When a button is clicked, this method is invoked
  //Takes in as a param the eventName, startDate, endDate, and location
  $scope.addEventToCalendar = function(eventName, startDate, endDate, location, _id)
  {
       //Database has startDate as 2015-10-15T19:00:00.000Z
       //So I split at the "T" to seperate the date and time
       splitStartDateAndTime = startDate.split("T");
       //Splitting up the date into pieces
       splitStartDate = splitStartDateAndTime[0].split("-");
       //Splitting up the time into pieces
       splitStartTime = splitStartDateAndTime[1].split(":");
       
       //Same as before but now I am doing it for the end date
       splitEndDateAndTime = endDate.split("T");
       splitEndDate = splitEndDateAndTime[0].split("-");
       splitEndTime = splitEndDateAndTime[1].split(":");
       
       finalStartDate = new Date(splitStartDate[0], Number(splitStartDate[1]) - 1,   
                                splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0, 0);
       finalEndDate = new Date(splitEndDate[0], Number(splitEndDate[1] - 1), splitEndDate[2], 
                              splitEndTime[0], splitEndTime[1], 0, 0, 0);
       //Using ngcordova to create an event to their native calendar
       $cordovaCalendar.createEvent({
            title: eventName,
            location: location["street"],
            notes: 'This is a note',
            startDate: finalStartDate,
            endDate: finalEndDate
        }).then(function (result) {
                console.log("Event created successfully");
                
                //Get the data from the local storage of list of all added events
                list_of_added_events = $localStorage.getObject("list_of_added_events");
                map_event = {};
                
                map_event[_id] = {"name": eventName, "location":location["street"], "startDate":startDate, "endDate":endDate};
                list_of_added_events.add(map_event);
                
                //Added event information to local phone
                $localStorage.setObject(list_of_added_events);
      
                //If successfully added, then alert the user that it has been added
                var alertPopup = $ionicPopup.alert({
                title: 'Event Added',
                template: eventName + ' has been added to your calendar :)'
            });

        }, function (err) {
                console.error("There was an error: " + err);
                //If unsuccessful added, then an alert with a error should pop up
                //Not sure if we want to pu the 'err' in the message
                var alertPopup = $ionicPopup.alert({
                title: 'Error',
                template: 'Could not add event to calendar: ' + err
            });
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

  //facebook setup
  $scope.showEventFacebook = function(url) {
      cordova.InAppBrowser.open(url, '_system', 'location=no');
  };
})

.controller('EventsCtrl', function($scope, $ajax, $localStorage, $location, constants, $ionicHistory) {
    
    //deletes cache so page loads again
    $scope.$on("$ionicView.enter", function () {
        
    
        /*$scope.$on("$ionicView.afterLeave", function () {
            $ionicHistory.clearCache();
        }); */

        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
        console.log(mins + "hmmmm");
        var url;
        if (mins === "" || mins === []) {
            url = constants.BASE_SERVER_URL + 'events';
            console.log("got here\n");
        }
        else {
            url = $ajax.buildQueryUrl(constants.BASE_SERVER_URL + 'events', "mins", 
                                      mins);
        }
        
        var events = [];
        $.ajax({
           url: url,
           type: "GET",
           dataType: "json",
           success: function (data) {
                jQuery.each(data, function( key, value ) {
                    var val = value;
                    var locale = "en-us";
                    
                    var eventDate = new Date(value.startDate);
                    val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' - '
                        + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
                        + eventDate.getDate() + ', ' + eventDate.getFullYear();

                        if (!value.image) {
                            val.image = { url: 'img/cru-logo.jpg' };
                        }
                    //check if event changed
                    list_of_added_events = $localStorage.getObject("list_of_added_events");
                    info_for_event = list_of_added_events[val._id];
                    if (!(info_for_event['name'] == val.name && info_for_event['location'] ==
                       val.location['street'] && info_for_event['startDate'] == val.startDate
                        && info_for_event['endDate'] == val.endDate))
                    {
                        //The event was changed bro
                        console.log("hi");
                    }
                    events.push(val);
                });
            }
        });
                
        $scope.events = events;
        $scope.goToEvent = function(id) {
            $location.path('/app/events/' + id);  
        };
    });
})
//utils.factory('$localStorage', ['$window', function($window) {

.controller('EventCtrl', function($scope, $stateParams, constants) {
    var url = constants.BASE_SERVER_URL + 'events/' + $stateParams.eventId;
    
    $.ajax({
       url: url,
       type: "GET",
       dataType: "json",
       success: function (value) {
            var val = value;
            var locale = "en-us";
           
            var eventDate = new Date(value.startDate);
            val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' - '
                + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
                + eventDate.getDate() + ', ' + eventDate.getFullYear();
           
            
            $scope.myEvent = val;
       }
    });
})

.controller('MissionsCtrl', function($scope) {
    var url = 'http://54.86.175.74:8080/summermissions';
    var missions = [];
    
    $.ajax({
       url: url,
       type: "GET",
       dataType: "json",
       success: function (data) {
            jQuery.each(data, function( key, value ) {
                if (value.image) {
                    missions.push({ 
                        id: value._id,
                        title: value.name,
                        desc: value.description,
                        img_url: value.image.url,
                        facebook: value.url
                    });
                } else {
                    missions.push({ 
                        id: value._id,
                        title: value.name,
                        desc: value.description,
                        facebook: value.url
                    });
                } 
            });
        }
    });
        
    $scope.missions = missions;
})

.controller('MissionCtrl', function($scope, $stateParams) {
    var url = 'http://54.86.175.74:8080/summermissions/' + $stateParams.missionId;
    
    $.ajax({
       url: url,
       type: "GET",
       dataType: "json",
       success: function (value) {
            var val = value;
            var locale = "en-us";
           
            var eventDate = new Date(value.startDate);
            val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' -- '
                + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
                + eventDate.getDate() + ', ' + eventDate.getFullYear();
           
            
            $scope.mySummerMission = val;
       }
    });
});