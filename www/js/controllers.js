
var module = angular.module('starter.controllers', ['EventCtrl', 'starter.controllers.camp', 'starter.controllers.min', 'starter.controllers.rides', 'articles', 'videos', 'ngCordova', 'ionic','PushModule', 'ComGroupCtrl']);

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

.controller('MissionCtrl', function($scope, $stateParams, $cordovaInAppBrowser, req, constants) {

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

    
        
    $scope.showOnline = function(url) {
        $cordovaInAppBrowser.open(url, '_system');  
    };
    
    req.get(url, success, err);
});

