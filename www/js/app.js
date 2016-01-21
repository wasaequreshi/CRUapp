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

  .state('app.browse', {
      url: '/browse',
      views: {
        'menuContent': {
          templateUrl: 'templates/browse.html'
        }
      }
    })

  .state('app.playlists', {
    url: '/playlists',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlists.html',
        controller: 'PlaylistsCtrl'
      }
    }
  })

  .state('app.single', {
    url: '/playlists/:playlistId',
    views: {
      'menuContent': {
        templateUrl: 'templates/playlist.html',
        controller: 'PlaylistCtrl'
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
  $urlRouterProvider.otherwise('/app/playlists');
});
