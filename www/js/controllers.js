var module = angular.module('starter.controllers', ['starter.controllers.camp', 'starter.controllers.min', 'starter.controllers.rides','ngCordova', 'ionic','PushModule']);

// allows for access of variable across controllers
module.service('allEvents', function () {
    var events = [];

    return {
        getEvents: function () {
            return events;
        },
        setEvents: function(eventList) {
            events = eventList;
        }
    };
});

module.controller('AppCtrl', function($scope, $ionicModal, $timeout, $cordovaCalendar, $ionicPopup) {

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


.controller('EventsCtrl', ["$scope", "$location", "req", "$localStorage", "constants", "$ionicHistory", "allEvents", function($scope, $location, req, $localStorage, constants, $ionicHistory, allEvents) {
    
>>>>>>> upstream/master
    //reloads page everytime
    $scope.$on("$ionicView.enter", function () {
        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;

        var url;
        if (mins === "" || mins === [] || !mins ) {
            url = constants.BASE_SERVER_URL + 'events';
            console.log("got here\n");
        }
        else {
            url = req.buildQueryUrl(constants.BASE_SERVER_URL + 'events', "mins", 
                                      mins);
        }
        
        var events = [];
        var success = function (data) {
            jQuery.each(data.data, function( key, value ) {
                var val = value;
                var locale = "en-us";

                var eventDate = new Date(val.startDate);
                val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' - '
                    + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
                    + eventDate.getDate() + ', ' + eventDate.getFullYear();

                    if (!value.image) {
                        val.image = { url: 'img/cru-logo.jpg' };
                    }

                events.push(val);
            });
        };
        
        var err = function(response) {
            $location.path('/app/error');
        };
        
        req.get(constants.BASE_SERVER_URL + 'events', success, err);

        $scope.events = events;
        console.log("Events added: " + events);
        allEvents.setEvents(events);
        $scope.goToEvent = function(id) {
            $location.path('/app/events/' + id);  
        };
    });
}])

/*<<<<<<< HEAD
.controller('EventCtrl', ["$scope", "$stateParams", "constants", "ServerUtil", function($scope, $stateParams, constants, ServerUtil) {
    
    var getEventSuccess = function (value) {
        var val = value;
        var locale = "en-us";

        var eventDate = new Date(value.startDate);
        val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' -- '
            + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
            + eventDate.getDate() + ', ' + eventDate.getFullYear();


        $scope.myEvent = val;
    };
    
    var getEventError = function (value) {
        console.log("getEventError");
    };
    
    ServerUtil.get('/events/' + $stateParams.eventId, getEventSuccess, getEventError);
}])

.controller('MissionsCtrl', ['$scope', 'ServerUtil', function($scope, ServerUtil) {
    var missions = [];
    var getMissionsSuccess = function (data) {
            for (key in value) {
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
            };
    }
    
    var getMissionsFail = function(data){
        console.log("Missions get Failed");
    }
    
    ServerUtil.get('/summermissions', getMissionsSuccess, getMissionsFail);
    
    $scope.missions = missions;
}])

.controller('MissionCtrl', ['$scope','$stateParams','ServerUtil', function($scope, $stateParams, ServerUtil) {
    var getMissionSuccess = function (value) {
        var val = value;
        var locale = "en-us";
        var eventDate = new Date(value.startDate);
        
        val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' -- '
            + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
            + eventDate.getDate() + ', ' + eventDate.getFullYear();
        $scope.mySummerMission = val;
    };
    var getMissionsFail = function(){
        //TODO need to finish this Get Mission Fail to let the UI know 
        console.log("get Mission failed");
    }
    
    ServerUtil.get('/summermissions/' + $stateParams.missionId, getMissionSuccess, getMissionsFail);
}]);
*/
.controller('EventCtrl', function($scope, $stateParams, req, constants) {
    var url = constants.BASE_SERVER_URL + 'events/' + $stateParams.eventId;
    var success = function (value) {
        var val = value.data;
        var locale = "en-us";

        var eventDate = new Date(val.startDate);
        val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' - '
            + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
            + eventDate.getDate() + ', ' + eventDate.getFullYear();


        $scope.myEvent = val;
    };
    
    var err = function(response) {
        $location.path('/app/error');
    };
    
    req.get(url, success, err);
})

.controller('MissionsCtrl', function($scope, $location, req, constants) {
    var url = constants.BASE_SERVER_URL + 'summermissions';
    var missions = [];
    var success = function (data) {
        jQuery.each(data.data, function( key, value ) {
            var val = value;
            var locale = "en-us";

            var eventDate = new Date(value.startDate);
            val.startDate = eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' - '
                + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
                + eventDate.getDate() + ', ' + eventDate.getFullYear();

                if (!value.image) {
                    val.image = { url: 'img/cru-logo.jpg' };
                }

            missions.push(val);
        });
    };
    
    var err = function(response) {
        $location.path('/app/error');
    };
    
    req.get(url, success, err);
    $scope.missions = missions;
    $scope.goToMission = function(id) {
        $location.path('/app/missions/' + id);  
    };
})

.controller('MissionCtrl', function($scope, $stateParams, req, constants) {
    var url = constants.BASE_SERVER_URL + 'summermissions/' + $stateParams.missionId;
    var success = function (value) {
        var val = value.data;
        var locale = "en-us";

        // Make dates human readable
        var eventDate = new Date(val.startDate);
        var endDate = new Date(val.endDate);
        val.startDate = eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
            + eventDate.getDate() + ', ' + eventDate.getFullYear();
        val.endDate = endDate.toLocaleDateString(locale, { month: 'long' }) + ' '
            + endDate.getDate() + ', ' + endDate.getFullYear();

        $scope.mySummerMission = val;
    };
    
    var err = function(response) {
        $location.path('/app/error');
    };
    
    req.get(url, success, err);
});
