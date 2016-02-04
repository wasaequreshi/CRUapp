// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js

angular.module('starter', ['ionic', 'starter.controllers', 'ui.bootstrap', 'ngCordova'])


.run(function($ionicPlatform) {
    console.log("App setup");
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if (window.cordova && window.cordova.plugins && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);

    }
    if (window.StatusBar) {
      // org.apache.cordova.statusbar required
      StatusBar.styleDefault();
    }
    
    
  });
})

.config(function($stateProvider, $urlRouterProvider) {
  $stateProvider

    .state('app', {
    url: '/app',
    abstract: true,
    templateUrl: 'templates/menu.html',
    controller: 'AppCtrl'
  })

  .state('app.splash', {
    url: '/splash',
    views: {
      'menuContent': {
        templateUrl: 'templates/splash.html',
        controller: 'AppCtrl'
      }
    }
  })

  .state('app.campuses', {
    url: '/campuses',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'CampusCtrl'
      }
    }
  })

  .state('app.ministries', {
    url: '/ministries',
    views: {
      'menuContent': {
        templateUrl: 'templates/signup.html',
        controller: 'MinCtrl'
      }
    }
  })

  .state('app.search', {
    url: '/search',
    views: {
      'menuContent': {
        templateUrl: 'templates/search.html'
      }
    }
  })

  .state('app.settings', {
      url: '/settings',
      views: {
        'menuContent': {
          templateUrl: 'templates/settings.html'
        }
      }
    })

  .state('app.events', {
    url: '/events',
    views: {
      'menuContent': {
        templateUrl: 'templates/events.html',
        controller: 'EventsCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/events/:eventId',
    views: {
      'menuContent': {
        templateUrl: 'templates/event.html',
        controller: 'EventCtrl'
      }
    }
  })
  
  .state('app.rides', {
    url: '/rides',
    views: {
      'menuContent': {
        templateUrl: 'templates/rideSharing/rides.html',
        controller: 'RidesCtrl'
      }
    }
  })
  
  .state('app.giveRide', {
    url: '/rides/give/:rideId',
    views: {
      'menuContent': {
        templateUrl: 'templates/rideSharing/give.html',
        controller: 'GiveRideCtrl'
      }
    }
  })
  
  .state('app.getRide', {
    url: '/rides/get/:rideId',
    views: {
      'menuContent': {
        templateUrl: 'templates/rideSharing/get.html',
        controller: 'GetRideCtrl'
      }
    }
  })
  
  .state('app.rideDriverList', {
    url: '/rides/get/:rideId/drivers',
    views: {
      'menuContent': {
        templateUrl: 'templates/rideSharing/driverList.html',
        controller: 'ChooseDriverCtrl'
      }
    }
  })
  
  .state('app.rideDriver', {
    url: '/rides/get/:rideId/driver/:driverId',
    views: {
      'menuContent': {
        templateUrl: 'templates/rideSharing/driver.html',
        controller: 'DriverViewCtrl'
      }
    }
  })
  
  .state('app.giveList', {
    url: '/rides/give/:rideId/riders',
    views: {
      'menuContent': {
        templateUrl: 'templates/rideSharing/ridersList.html',
        controller: 'RideListCtrl'
      }
    }
  })
  
  .state('app.missions', {
      url: '/missions',
      views: {
        'menuContent': {
          templateUrl: 'templates/missions.html',
          controller: 'MissionsCtrl'
        }
      }
    })
  
  .state('app.mission', {
      url: '/missions/:missionId',
      views: {
        'menuContent': {
          templateUrl: 'templates/mission.html',
          controller: 'MissionCtrl'
        }
      }
    })

  .state('app.error', {
      url: '/error',
      views: {
          'menuContent': {
          templateUrl: 'templates/error.html'
        }
      }
  });

// if none of the above states are matched, use this as the fallback
  $urlRouterProvider.otherwise('/app/events');
});
