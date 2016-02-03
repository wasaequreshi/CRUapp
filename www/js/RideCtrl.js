var ride = angular.module('starter.controllers.rides', ['starter.controllers.utils']);


ride.controller('RidesCtrl', function($scope, $location, $ionicHistory, $ajax, $localStorage, allEvents, constants) {
    //TO DO CHANGE URL
   /* url = $ajax.buildQueryUrl(constants.BASE_SERVER_URL + 'events', "mins", 
                                      mins);
    */
    
    //returns -1 if not in the array and the index otherwise
    var checkArr = function(item, arr) {
        return $.inArray(item, arr);
    };
    
    //reload page everytime
    $scope.$on("$ionicView.enter", function () {
    
        $ionicHistory.clearHistory();
        var myrides = [];

        var success = function (data) {

        };

        var err = function(xhr, text, err) {
            //if there is an error (ie 404, 500, etc) redirect to the error page
            $location.path('/app/error');
        };

        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        //$ajax.get(url, 'json', success, err);

        $scope.title = "Rides";
        console.log("rides: " + allEvents.getEvents());
        myrides = allEvents.getEvents();

        //disable the buttons if already a driver/rider
        var driverText = "";
        var riderText = "";
        var index;

        //loop through the rides to see if currently driving or riding
        console.log("Checking for drivers....");
        for (index = 0; index < myrides.length; ++index) {
            driverText = false;
            riderText = false;

            if (checkArr(myrides[index].id, driving) != -1) {
                riderText = true;
            }
            else if (checkArr(myrides[index].id, riding) != -1) {
                driverText = true;
            }

            //adding the button text for the event
            myrides[index].dText = driverText;
            myrides[index].rText = riderText;
        }

        $scope.rides = myrides;
        
    });
    
    
    
    $scope.goToGetRide = function(tempID) {
        
        
        /* TODO: get from the server if this person is already a driver */
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);
        var isRider = checkArr(tempID, riding);
        /* TODO: get driver ID */
        var driverID = "1";
        
        //if is a rider for the event
        if (isRider != -1) {
            $location.path('/app/rides/get/' + tempID + '/driver/' + driverID);
        }
        else {
            $location.path('/app/rides/get/' + tempID + '/drivers');
        }
    };
    
    $scope.goToGiveRide = function(tempID) {
        
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var isDriver = checkArr(tempID, driving);
        
        //if a driver for this event
        if (isDriver != -1) {
            $location.path('/app/rides/give/' + tempID + '/riders');
        }
        else {
            $location.path('/app/rides/give/' + tempID);
        }
    };
})

.controller('GetRideCtrl', function($scope, $location, $ionicHistory, $ajax, $localStorage, allEvents, constants, $stateParams) {
    var tempID = $stateParams.rideId;
    
    $scope.getRide = function() {
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        if (typeof riding.length === "undefined" || riding.length === 0) {
            console.log("Not driving yet");
            riding = [];
            riding.push(tempID);
        }
        else if ($.inArray(tempID, riding) === -1) {
            riding.push(tempID);
        }

        console.log("Riding these events: " + riding);
        $localStorage.setObject(constants.MY_RIDES_RIDER, riding);

        /* TODO: Add rider to database */

        $location.path('/app/rides');
    };
})

.controller('ChooseDriverCtrl', function($scope, $location, $ionicHistory, $ajax, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    
    var mydrivers = [];
    
    /* TODO: Fill in with real data */
    mydrivers.push({
        id: "1",
        name: "Cody",
        phone: "707-494-3342",
        leavetime: "10/18 6:00PM",
        pickup: "PAC"
    });
    mydrivers.push({
        id: "2",
        name: "Bob",
        phone: "111-222-3333",
        leavetime: "10/18 3:00PM",
        pickup: "123 Grand Ave, SLO"
    });
    mydrivers.push({
        id: "3",
        name: "Connor",
        phone: "911",
        leavetime: "10/18 1:30PM",
        pickup: "Library"
    });
    
    $scope.drivers = mydrivers;
    
    $scope.chooseDriver = function() {
        $location.path('/app/rides/get/' + rideID);
    };
})

.controller('GiveRideCtrl', function($scope, $ionicPopup, $timeout, $location, $ionicHistory, $ajax, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var tempID = $stateParams.rideId;
    
    $scope.checkRider = function() {
        //check if rider is valid by name in DB
        /* TODO: change this valid statement */
        var valid = true;
        
        if (!valid) {
            //popup for driver error
              var myPopup = $ionicPopup.show({
                template: '<p>Sorry, you are not a valid driver.</p>',
                title: 'Driver Error',
                scope: $scope,
                buttons: [
                  { text: 'Ok' },
                ]
              });

              myPopup.then(function(res) {
                console.log('Driver Error', res);
              });

              $timeout(function() {
                 myPopup.close(); //close the popup after 3 seconds for some reason
              }, 3000);
        }
        else {
            var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            
            if (typeof driving.length === "undefined" || driving.length === 0) {
                console.log("Not driving yet");
                driving = [];
                driving.push(tempID);
            }
            else if ($.inArray(tempID, driving) === -1) {
                driving.push(tempID);
            }

            console.log("Driving these events: " + driving);
            $localStorage.setObject(constants.MY_RIDES_DRIVER, driving);
            
            /* TODO: Add driver to database */
            
            $location.path('/app/rides');
        }
    };
    
})

.controller('DriverViewCtrl', function($scope, $location, $ionicHistory, $ajax, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    
    /* TODO: Fill in with real data */
    var mydriver = {
        id: "1",
        name: "Cody",
        phone: "707-494-3342",
        leavetime: "10/18 6:00PM",
        pickup: "PAC"
    };

    $scope.driver = mydriver;
    
    $scope.cancelRide = function() {
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);
        var idx = riding.indexOf(rideID);
        if (idx != -1) {
            riding.splice(idx, 1);
            $localStorage.setObject(constants.MY_RIDES_RIDER, riding);
        }
        
        /* TODO: delete driver from database */
        /* TODO: (push) notify riders that the driver canceled */
        
        $location.path('/app/rides');
    };
   
})

.controller('RideListCtrl', function($scope, $location, $ionicHistory, $ajax, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    
    var myriders = [];
    
    /* TODO: Fill in with real data */
    myriders.push({
        id: "1",
        name: "Cody",
        phone: "707-494-3342"
    });
    myriders.push({
        id: "2",
        name: "Bob",
        phone: "111-222-3333"
    });
    myriders.push({
        id: "3",
        name: "Connor Hi",
        phone: "911...?"
    });
    
    $scope.riders = myriders;
    
    $scope.cancelRide = function() {
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var idx = driving.indexOf(rideID);
        if (idx != -1) {
            driving.splice(idx, 1);
            $localStorage.setObject(constants.MY_RIDES_DRIVER, driving);
        }
        
        /* TODO: delete driver from database */
        /* TODO: (push) notify riders that the driver canceled */
        
        $location.path('/app/rides');
    };
   
});