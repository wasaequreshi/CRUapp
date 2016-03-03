
var module = angular.module('starter.controllers', ['starter.controllers.camp', 'starter.controllers.min', 'starter.controllers.rides', 'articles', 'videos', 'ngCordova', 'ionic','PushModule', 'ComGroupCtrl']);

// allows for access of variable across controllers
module.service('allEvents', function() {
    var events = [];

    return {
        getEvents: function() {
            return events;
        },
        setEvents: function(eventList) {
            events = eventList;
        }
    };
});
module.run(function($ionicPlatform) {
    $ionicPlatform.ready(function() {
        if(window.cordova && window.cordova.plugins.Keyboard) {
            cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        }
        if(window.StatusBar) {
            StatusBar.styleDefault();
        }
    });
});


module.controller('AppCtrl', function(pushService, $rootScope, $scope, $ionicModal, $ionicPlatform, $timeout, $cordovaCalendar, $ionicPopup, $localStorage, $cordovaInAppBrowser) {

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
        $scope.modal.remove();
    };

    // Open the login modal
    $scope.login = function() {
      $scope.modal.show();
    };

    //When a button is clicked, this method is invoked
    //Takes in as a param the eventName, startDate, endDate, and location
    $scope.addEventToCalendar = function(eventName, location, _id, originalStartDate, originalEndDate) {
        //Database has startDate as 2015-10-15T19:00:00.000Z
        //So I split at the "T" to seperate the date and time
    		
        splitStartDateAndTime = originalStartDate.split('T');
        //Splitting up the date into pieces
        splitStartDate = splitStartDateAndTime[0].split('-');
        //Splitting up the time into pieces
        splitStartTime = splitStartDateAndTime[1].split(':');

        //Same as before but now I am doing it for the end date
        splitEndDateAndTime = originalEndDate.split('T');
        splitEndDate = splitEndDateAndTime[0].split('-');
        splitEndTime = splitEndDateAndTime[1].split(':');

        //This will create the final format for the date, which the plugin uses
        finalStartDate = new Date(splitStartDate[0], Number(splitStartDate[1]) - 1,
                                 splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0, 0);
        finalEndDate = new Date(splitEndDate[0], Number(splitEndDate[1] - 1), splitEndDate[2],
                               splitEndTime[0], splitEndTime[1], 0, 0, 0);

        helper_function_adding_calendar(eventName, location, finalStartDate, finalEndDate, _id, originalStartDate, originalEndDate);
    };

    helper_function_adding_calendar = function(eventName, location, finalStartDate, finalEndDate, _id, originalStartDate,
        originalEndDate) {
        //Using ngcordova to create an event to their native calendar
        $cordovaCalendar.createEvent({
          title: eventName,
          location: location['street'],
          notes: 'This is a note',
          startDate: finalStartDate,
          endDate: finalEndDate
      }).then(function(result) {

          console.log('Event created successfully');

          //Get the data from the local storage of list of all added events
          list_of_added_events = $localStorage.getObject('list_of_added_events');
          if (list_of_added_events == null) {
              list_of_added_events = {};
          }
          list_of_added_events[_id] = {'name': eventName, 'location': location['street'], 'secretStartDate': originalStartDate,
            'secretEndDate': originalEndDate};
          //Added event information to local phone
          $localStorage.setObject('list_of_added_events', list_of_added_events);

          //If successfully added, then alert the user that it has been added
          var alertPopup = $ionicPopup.alert(
          {
              title: 'Event Added',
              template: eventName + ' has been added to your calendar!'
          });

      }, function(err) {
          console.error('There was an error: ' + err);
          //If unsuccessful added, then an alert with a error should pop up

          var alertPopup = $ionicPopup.alert(
          {
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
        $timeout(function() 
        {
            $scope.closeLogin();
        }, 1000);
    };

    /**
    * Set up push notification 
    */
    $rootScope.$on('$cordovaPushV5:notificationReceived', pushService.onNotificationRecieved);//);
    //error happened
    $rootScope.$on('$cordovaPushV5:errorOccurred', pushService.onError);//);



  //set up when the application is ready 
  $ionicPlatform.ready(function(){
    // call to register automatically upon device ready


    promise = pushService.push_init();
    if (promise){
      promise.then(function (result) {
          console.log("Init success " + JSON.stringify(result));
      }, function (err) {
          console.log("Init error " + JSON.stringify(err));
      });
    };
  })
})

.controller('EventsCtrl', function($scope, $location, req, $localStorage, $location, req, constants, $ionicHistory, allEvents, $cordovaCalendar) {
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    //reloads page everytime
    $scope.$on('$ionicView.enter', function() {
        $scope.$emit('$cordovaPushV5:notificationReceived',{"stillthere":"?"});
        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
        console.log(mins + 'hmmmm');
        var url;

        var events = [];
        var success = function(data) {
            jQuery.each(data.data, function(key, value) {
                var val = value;
                var locale = 'en-us';
				
                var eventDate = new Date(val.startDate);
    						temp1 = val.startDate;
    						temp2 = val.endDate;
                val.secretStartDate = temp1;
                val.secretEndDate = temp2;
                console.log("Before:");
        				console.log(val.startDate);
                console.log(val.endDate);
                console.log("LocaleString: start");
                console.log("Day:");
                console.log(eventDate.getDay());
                console.log(eventDate.toLocaleDateString(locale, {weekday: 'long'}));
                val.startDate = days[eventDate.getDay()] + ' - ' +
                        months[eventDate.getMonth()] + ' ' +
                        eventDate.getDate() + ', ' + eventDate.getFullYear();

                eventDate = new Date(val.endDate);
                console.log("LocaleString: end");
                console.log(eventDate.toLocaleDateString(locale, {weekday: 'long'}));
                val.endDate = days[eventDate.getDay()] + ' - ' +
                    months[eventDate.getMonth()] + ' ' +
                    eventDate.getDate() + ', ' + eventDate.getFullYear();
				
                if (!value.image) {
                    val.image = {url: 'img/cru-logo.jpg'};
                }
                console.log("After:");
                console.log(val.startDate);
                console.log(val.endDate);

                helper_function_updating_calendar(val);
                events.push(val);
				
            });
        };

        var err = function(response) {
            $location.path('/app/error');
        };


        if (mins === '' || mins === [] || typeof mins === 'undefined') {
            url = constants.BASE_SERVER_URL + 'event/list';
            req.get(url , success, err);
            console.log('getting the event list\n');
        } else {

            url = constants.BASE_SERVER_URL + 'event/find?Content-Type: application/x-www-form-urlencoded';
            minsIds = [];
            for (var i = 0; i < mins.length; i++) {
                minsIds.push(mins[i]._id);
            }
            console.log('MINISITRYIDS' + JSON.stringify(minsIds));

            var queryParams = {
                'parentMinistries': {'$in': minsIds}
            };
            req.post(url, queryParams, success, err);
        }
        $scope.events = events;
        console.log('Events added: ' + events);
        allEvents.setEvents(events);
        $scope.goToEvent = function(id) {
            $location.path('/app/events/' + id);
        };
    });


    var helper_function_updating_calendar = function(val) {

        //check if event changed
        list_of_added_events = $localStorage.getObject('list_of_added_events');
        info_for_event = list_of_added_events[val._id];

        if (!(info_for_event == null)) {
            if (!(info_for_event['name'] === val.name && JSON.stringify(info_for_event['location']) ===
               JSON.stringify(val.location['street']) && info_for_event['secretStartDate'] === val.secretStartDate &&
                info_for_event['secretEndDate'] === val.secretEndDate)) {
                //The event was changed bro
                console.log("Updating");
                update_event(info_for_event, val);


            }
        }
    };

    var update_event = function(info_for_event, val) {
        var originalStartDate = info_for_event['secretStartDate'];
        var originalEndDate = info_for_event['secretEndDate'];
        splitStartDateAndTime = originalStartDate.split('T');
        //Splitting up the date into pieces
        splitStartDate = splitStartDateAndTime[0].split('-');
        //Splitting up the time into pieces
        splitStartTime = splitStartDateAndTime[1].split(':');

        //Same as before but now I am doing it for the end date
        splitEndDateAndTime = originalEndDate.split('T');
        splitEndDate = splitEndDateAndTime[0].split('-');
        splitEndTime = splitEndDateAndTime[1].split(':');

        //This will create the final format for the date, which the plugin uses
        finalStartDate = new Date(splitStartDate[0], Number(splitStartDate[1]) - 1,
                                 splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0, 0);
        finalEndDate = new Date(splitEndDate[0], Number(splitEndDate[1] - 1), splitEndDate[2],
                               splitEndTime[0], splitEndTime[1], 0, 0, 0);
        $cordovaCalendar.deleteEvent({
            newTitle: info_for_event['name'],
            location: info_for_event['location'],
            notes: 'This is a note',
            startDate: finalStartDate,
            endDate: finalEndDate
        }).then(function(result) {
            console.log("Success delete");
            helper_function_update_calendar(val);
            // success
        }, function(err) {
            // error
            console.log("Failed to delete");
        });
    };

    var helper_function_update_calendar = function(val) {
      var originalStartDate = val.secretStartDate;
      var originalEndDate = val.secretEndDate;

      splitStartDateAndTime = originalStartDate.split('T');
      //Splitting up the date into pieces
      splitStartDate = splitStartDateAndTime[0].split('-');
      //Splitting up the time into pieces
      splitStartTime = splitStartDateAndTime[1].split(':');

      //Same as before but now I am doing it for the end date
      splitEndDateAndTime = originalEndDate.split('T');
      splitEndDate = splitEndDateAndTime[0].split('-');
      splitEndTime = splitEndDateAndTime[1].split(':');

      //This will create the final format for the date, which the plugin uses
      finalStartDate = new Date(splitStartDate[0], Number(splitStartDate[1]) - 1,
                               splitStartDate[2], splitStartTime[0], splitStartTime[1], 0, 0, 0);
      finalEndDate = new Date(splitEndDate[0], Number(splitEndDate[1] - 1), splitEndDate[2],
                             splitEndTime[0], splitEndTime[1], 0, 0, 0);
      //Using ngcordova to create an event to their native calendar
      $cordovaCalendar.createEvent({
          title: val.name,
          location:  val.location['street'],
          notes: 'This is a note',
          startDate: finalStartDate,
          endDate: finalEndDate
      }).then(function(result) {

          console.log('Event created successfully');

          //Get the data from the local storage of list of all added events
          list_of_added_events = $localStorage.getObject('list_of_added_events');

          list_of_added_events[val._id] = {'name': val.name, 'location': val.location['street'], 'secretStartDate': val.secretStartDate,
          'secretEndDate': val.secretEndDate};

          //Added event information to local phone
          $localStorage.setObject('list_of_added_events', list_of_added_events);

      }, function(err) {
          console.error('There was an error: ' + err);

      });
    };

})

.controller('EventCtrl', function($scope, $stateParams, $location, $localStorage, $cordovaInAppBrowser, req, convenience, constants) {
    var days = ["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"];
    var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    
    var url = constants.BASE_SERVER_URL + 'event/' + $stateParams.eventId;

    var val;

    var checkArr = function(item, arr) {
        for (var i = 0; i < arr.length; i++) {
            if (arr[i].rideId === item) {
                return i;
            }
        }

        return -1;
    };

    var success = function(value) {
        val = value.data;
        var locale = 'en-us';

        // make the dates human readable
        var eventDate = new Date(val.startDate);
        var temp1 = val.startDate;
        var temp2 = val.endDate;
        val.secretStartDate = temp1;
        val.secretEndDate = temp2;
        val.startDate = days[eventDate.getDay()] + ' - ' +
                        months[eventDate.getMonth()] + ' ' +
                        eventDate.getDate() + ', ' + eventDate.getFullYear();

        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        // check to see if the user is riding or driving to the event
        $scope.isDriving = checkArr(val._id, driving) >= 0 ? true : false;
        $scope.isRiding = checkArr(val._id, riding) >= 0 ? true : false;
        $scope.myEvent = val;
    };

    var err = function(response) {
        $location.path('/app/error');
    };

    req.get(url, success, err);

    $scope.$on('$ionicView.enter', function() {

        if (val) {
            var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

            $scope.isDriving = checkArr(val._id, driving) >= 0 ? true : false;
            $scope.isRiding = checkArr(val._id, riding) >= 0 ? true : false;
        }
    });

    // button functions
    $scope.goToGetRide = function(id) {
        $location.path('/app/rides/' + id + '/drivers');
    };

    $scope.viewDriverInfo = function(id) {
        var rides = $localStorage.getObject(constants.MY_RIDES_RIDER);
        var index = checkArr(id, rides);
        $location.path('/app/rides/' + id + '/driver/' + rides[index].driverId);
    };

    $scope.signUpToDrive = function(id) {
        $location.path('/app/drive/' + id);
    };

    $scope.viewRidersInfo = function(id) {
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var index = checkArr(id, driving);
        $location.path('/app/drive/' + id + '/riders/' + driving[index].driverId);
    };
    
    $scope.showEventFacebook = function(url) {
        $cordovaInAppBrowser.open(url, '_system');
    };
})

.controller('MissionsCtrl', function($scope,$rootScope,$timeout, $location, req, constants) {
    var url = constants.BASE_SERVER_URL + 'summermission/list';
    var missions = [];
    var success = function(data) {
        jQuery.each(data.data, function(key, value) {
            var val = value;
            var locale = 'en-us';

            var eventDate = new Date(value.startDate);
            val.startDate = eventDate.toLocaleDateString(locale, {weekday: 'long'}) + ' - ' +
                eventDate.toLocaleDateString(locale, {month: 'long'}) + ' ' +
                eventDate.getDate() + ', ' + eventDate.getFullYear();

            if (!value.image) {
                val.image = {url: 'img/cru-logo.jpg'};
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

    var url = constants.BASE_SERVER_URL + 'summermission/' + $stateParams.missionId;
    var success = function(value) {
        var val = value.data;
        var locale = 'en-us';

        // Make dates human readable
        var eventDate = new Date(val.startDate);
        var endDate = new Date(val.endDate);
        val.startDate = eventDate.toLocaleDateString(locale, {month: 'long'}) + ' ' +
            eventDate.getDate() + ', ' + eventDate.getFullYear();
        val.endDate = endDate.toLocaleDateString(locale, {month: 'long'}) + ' ' +
            endDate.getDate() + ', ' + endDate.getFullYear();

        $scope.mySummerMission = val;
    };

    var err = function(response) {
        $location.path('/app/error');
    };

    req.get(url, success, err);
});

