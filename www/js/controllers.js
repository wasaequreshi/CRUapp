var module = angular.module('starter.controllers', ['EventCtrl', 'MissionCtrl', 'starter.controllers.camp', 'starter.controllers.min', 'starter.controllers.rides', 'articles', 'videos', 'ngCordova', 'ionic','PushModule', 'ComGroupCtrl']);

//timeAndDate is in the form 2015-10-15T19:00:00.000Z
//returns an array with:
//index 0: date
//index 1: time
var getTimeAndDate = function(timeAndDate)
{
    //Split at the "T" to separate the date and time
    splitDateAndTime = timeAndDate.split('T');
    
    //Splitting up the date into pieces
    date = splitDateAndTime[0].split('-');
    
    //Splitting up the time into pieces
    time = splitDateAndTime[1].split(':');

    return [date, time];
}

//Takes in date and time to return Date object
var createDate = function(date, time)
{
    date = new Date(date[0], Number(date[1]) - 1, date[2], time[0], time[1], 0, 0, 0);
    return date;
}

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
        
        startDateAndTime = getTimeAndDate(originalStartDate);
        startDate = startDateAndTime[0];
        startTime = startDateAndTime[1];

        endDateAndTime = getTimeAndDate(originalEndDate);
        endDate = endDateAndTime[0];
        endTime = endDateAndTime[1];

        finalStartDate = createDate(startDate, startTime);    
        finalEndDate = createDate(endDate, endTime);

        helper_function_adding_calendar(eventName, location, finalStartDate, finalEndDate, _id, originalStartDate, originalEndDate);
    };

    helper_function_adding_calendar = function(eventName, location, finalStartDate, finalEndDate, _id, originalStartDate,
        originalEndDate) 
    {

        //Using ngcordova to create an event to their native calendar
        $cordovaCalendar.createEvent({
            title: eventName,
            location: location['street'],
            startDate: finalStartDate,
            endDate: finalEndDate
        }).then(function(result) {

            //Get the data from the local storage of list of all added events
            list_of_added_events = $localStorage.getObject('list_of_added_events');
            
            if (list_of_added_events == null) {
                list_of_added_events = {};
            }

            list_of_added_events[_id] = {'name': eventName, 'location': location['street'], 
                'secretStartDate': originalStartDate, 'secretEndDate': originalEndDate};
            
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
      }, function (err) {
          console.log("Init error " + JSON.stringify(err));
      });
    };
  })
});
