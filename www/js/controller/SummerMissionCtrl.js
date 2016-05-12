var missionCtrl = angular.module('MissionCtrl', []);

missionCtrl.controller('MissionsCtrl', function($scope, $location, api, constants, convenience) {
    convenience.showLoadingScreen('Loading Summer Missions');
    var missions = [];

    // on success add all the ministries to the ministries list
    var success = function(data) {
        data.data.forEach(function(value) {
            var val = value;
            var locale = 'en-us';

            // make the date human readeable
            val.startDate = convenience.formatDate(new Date(value.startDate), false);

            // if there is not an image, set the image to the placeholder
            if (!value.image) {
                val.image = {url: constants.PLACEHOLDER_IMAGE};
            }

            missions.push(val);
            convenience.hideLoadingScreen();
        });
    };

    // when there is an error, print it out and show the error page in app
    var err = convenience.defaultErrorCallback('MissionCtrl',
        'Could not retrieve list of summer missions from the server');

    // send the request to the server
    api.getAllMissions(success, err);

    // add the missions to the scope so they can be accessed in the view
    $scope.missions = missions;
    
    // navigate to the specific image page when a mission is clicked
    $scope.goToMission = function(id) {
        $location.path('/app/missions/' + id);
    };
})

missionCtrl.controller('MissionCtrl', function($scope, $stateParams, $cordovaInAppBrowser, cal, api, constants, convenience, 
    $localStorage, $cordovaCalendar, $ionicPopup) { 
    var success = function(value) {
        var val = value.data;

        // format the dates to be human readable
        val.secretStartDate = val.startDate;
        val.secretEndDate = val.endDate;

        val.startDate = convenience.formatDate(new Date(val.startDate), false);
        val.endDate = convenience.formatDate(new Date(val.endDate), false);

        if (!value.data.image) {
            val.image = {url: constants.PLACEHOLDER_IMAGE};
        }
        helperFunctionUpdatingCalendar(val);
        $scope.mySummerMission = val;
    };

    var helperFunctionUpdatingCalendar = function(val) {
        //check if event changed
        listOfAddedEvents = $localStorage.getObject('listOfAddedEvents');
        infoForEvent = listOfAddedEvents[val._id];

        if (!(infoForEvent == null)) {
            if (!(infoForEvent['name'] === val.name && JSON.stringify(infoForEvent['location']) ===
               JSON.stringify(val.location['street']) && infoForEvent['secretStartDate'] === val.secretStartDate &&
                infoForEvent['secretEndDate'] === val.secretEndDate)) {
                //The event was changed bro  <----- you tell em' broseph! <3 Connor
                updateEvent(infoForEvent, val);
            }
        }
    };

    var updateEvent = function(infoForEvent, val) {
        var originalStartDate = infoForEvent['secretStartDate'];
        var originalEndDate = infoForEvent['secretEndDate'];
        
        startDateAndTime = eventCtrl.getTimeAndDate(originalStartDate);
        startDate = startDateAndTime[0];
        startTime = startDateAndTime[1];

        endDateAndTime = eventCtrl.getTimeAndDate(originalEndDate);
        endDate = endDateAndTime[0];
        endTime = endDateAndTime[1];

        finalStartDate = eventCtrl.createDate(startDate, startTime);    
        finalEndDate = eventCtrl.createDate(endDate, endTime);
        
        $cordovaCalendar.deleteEvent({
            newTitle: infoForEvent['name'],
            location: infoForEvent['location'],
            startDate: finalStartDate,
            endDate: finalEndDate
        }).then(function(result) {
            helperFunctionUpdateCalendar(val);
            // success
        }, function(err) {
            // error
            console.error("Failed to delete event from calender: " + err);
        });
    };

    var helperFunctionUpdateCalendar = function(val) {
      var originalStartDate = val.secretStartDate;
      var originalEndDate = val.secretEndDate;

      startDateAndTime = eventCtrl.getTimeAndDate(originalStartDate);
      startDate = startDateAndTime[0];
      startTime = startDateAndTime[1];

      endDateAndTime = eventCtrl.getTimeAndDate(originalEndDate);
      endDate = endDateAndTime[0];
      endTime = endDateAndTime[1];

      finalStartDate = eventCtrl.createDate(startDate, startTime);    
      finalEndDate = eventCtrl.createDate(endDate, endTime);

      //Using ngcordova to create an event to their native calendar
      $cordovaCalendar.createEvent({
          title: val.name,
          location:  val.location['street'],
          startDate: finalStartDate,
          endDate: finalEndDate
      }).then(function(result) {
          //Get the data from the local storage of list of all added events
          listOfAddedEvents = $localStorage.getObject('listOfAddedEvents');

          listOfAddedEvents[val._id] = {'name': val.name, 'location': val.location['street'], 'secretStartDate': val.secretStartDate,
          'secretEndDate': val.secretEndDate};

          //Added event information to local phone
          $localStorage.setObject('listOfAddedEvents', listOfAddedEvents);
      }, function(err) {
          console.error('There was an error: ' + err);
      });
    };

    var err = convenience.defaultErrorCallback('MissionCtrl', 
        'Could not retrieve summer mission ' + $stateParams.missionId +
        ' from the server');

    $scope.addToCalendar = function(event) {
        cal.addToCalendar(event.name, event.location, event._id,
            event.secretStartDate, event.secretEndDate);
    };

    $scope.showOnline = function(url) {
        var isIOS = ionic.Platform.isIOS();
        var isAndroid = ionic.Platform.isAndroid();
        var options = {};
        var browserType = '';
        if (isIOS)
        {
            options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'yes',
                zoom: 'no'
            };
            browserType = '_blank';
        }
        else if (isAndroid)
        {
            options = {
                location: 'yes',
                clearcache: 'yes',
                toolbar: 'no',
                zoom: 'no'
            };
            browserType = '_self';
        }
        $cordovaInAppBrowser.open(url, browserType, options);

        // $cordovaInAppBrowser.open(url, '_self', {
        //     clearcache: 'yes',
        //     zoom: 'no',
        //     location: 'yes'
        // });  
    };
    
    api.getMission($stateParams.missionId, success, err);
});