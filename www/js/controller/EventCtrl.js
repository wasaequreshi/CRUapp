var eventCtrl = angular.module('EventCtrl', []);

eventCtrl.controller('EventsCtrl', function($scope, $location, req, $localStorage, $location, req, constants, $ionicHistory, allEvents, $cordovaCalendar, convenience) {
    //reloads page everytime
    $scope.$on('$ionicView.enter', function() {
        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
        var url;

        var events = [];
        var success = function(data) {
            data.data.forEach(function(value) {
                var val = value;

                val.secretStartDate = val.startDate;
                val.secretEndDate = val.endDate;
                val.startDate = convenience.formatDate(new Date(val.startDate), true);
                val.endDate = convenience.formatDate(new Date(val.endDate), true);
				
                if (!value.image) {
                    val.image = {url: constants.PLACEHOLDER_IMAGE};
                }

                helper_function_updating_calendar(val);
                events.push(val);
            });
        };

        var err = convenience.defaultErrorCallback('EventCtrl',
            'Could not retrieve list of events from the server');


        if (mins === '' || mins === [] || typeof mins === 'undefined') {
            url = constants.BASE_SERVER_URL + 'event/list';
            req.get(url , success, err);
        } else {
            url = constants.BASE_SERVER_URL + 'event/find?Content-Type: application/x-www-form-urlencoded';
            minsIds = [];
            for (var i = 0; i < mins.length; i++) {
                minsIds.push(mins[i]._id);
            }

            var queryParams = {
                'parentMinistries': {'$in': minsIds}
            };
            req.post(url, queryParams, success, err);
        }

        $scope.events = events;
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
            helper_function_update_calendar(val);
            // success
        }, function(err) {
            // error
            console.error("Failed to delete event from calender: " + err);
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
    var url = constants.BASE_SERVER_URL + 'event/' + $stateParams.eventId;
    var val;

    var success = function(value) {
        val = value.data;

        // make the dates human readable
        val.secretStartDate = val.startDate;
        val.secretEndDate = val.endDate;
        val.startDate = convenience.formatDate(new Date(val.startDate), true);

        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        // check to see if the user is riding or driving to the event
        $scope.isDriving = convenience.containsAtIndex(val._id, driving) >= 0 ? true : false;
        $scope.isRiding = convenience.containsAtIndex(val._id, riding) >= 0 ? true : false;
        $scope.myEvent = val;
    };

    var err = convenience.defaultErrorCallback('EventCtrl', 
        'Could not retrieve event ' + $stateParams.eventId + ' from the server');

    req.get(url, success, err);

    $scope.$on('$ionicView.enter', function() {
        if (val) {
            var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

            $scope.isDriving = convenience.containsAtIndex(val._id, driving) >= 0 ? true : false;
            $scope.isRiding = convenience.containsAtIndex(val._id, riding) >= 0 ? true : false;
        }
    });

    // button functions
    $scope.goToGetRide = function(id) {
        $location.path('/app/rides/' + id + '/drivers');
    };

    $scope.viewDriverInfo = function(id) {
        var rides = $localStorage.getObject(constants.MY_RIDES_RIDER);
        var index = convenience.containsAtIndex(id, rides);
        $location.path('/app/rides/' + id + '/driver/' + rides[index].driverId);
    };

    $scope.signUpToDrive = function(id) {
        $location.path('/app/drive/' + id);
    };

    $scope.viewRidersInfo = function(id) {
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var index = convenience.containsAtIndex(id, driving);
        $location.path('/app/drive/' + id + '/riders/' + driving[index].driverId);
    };
    
    $scope.showEventFacebook = function(url) {
        $cordovaInAppBrowser.open(url, '_system');
    };
});