var ride = angular.module('starter.controllers.rides', ['starter.controllers.utils']);


ride.controller('RidesCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants) {
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
        //clear page history
        $ionicHistory.clearHistory();
        var myrides = [];

        var success = function (data) {
            console.log("Hey rides!");
            rides = test["data"];
                
        };

        var err = function(xhr, text, err) {
            //if there is an error (ie 404, 500, etc) redirect to the error page
            $location.path('/app/error');
        };

        url = constants.BASE_SERVER_URL + "rides";
        //req.get(url, success, err);
        
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        //$ajax.get(url, 'json', success, err);

        $scope.title = "Rides";
        myrides = allEvents.getEvents();

        //disable the buttons if already a driver/rider
        var driverText;
        var riderText;
        var index;

        //loop through the rides to see if currently driving or riding
        for (index = 0; index < myrides.length; ++index) {
            driverText = false;
            riderText = false;

            if (checkArr(myrides[index]._id, driving) != -1) {
                riderText = true;
            }
            else if (checkArr(myrides[index]._id, riding) != -1) {
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
        console.log("Here bro");
        console.log(tempID);
        $localStorage.setObject(constants.SELECTED_RIDE, tempID);

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

.controller('GetRideCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
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

.controller('ChooseDriverCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    
    var mydrivers = [];
    
    var success = function (data) {
        var datetime;
        
        console.log("Hey rides!");
        rides = data["data"];
        console.log(rides);
        selectedRide = $localStorage.getObject(constants.SELECTED_RIDE);
        for (var i = 0; i < rides.length; i++)
        {
            ride = rides[i];
            if (selectedRide === ride["event"])
            {
                var locale = "en-us";

                var eventDate = new Date(ride["time"]);
                datetime = eventDate.getHours() + ":" + eventDate.getMinutes() + " " 
                    + eventDate.toLocaleDateString(locale, { weekday: 'long' }) + ' - '
                    + eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
                    + eventDate.getDate() + ', ' + eventDate.getFullYear();
                
                mydrivers.push({
                //dangerous to do because the rides will always be changing
                id: i + 1,
                event_id: ride["event"], 
                name: ride["driverName"],
                phone: ride["driverNumber"],
                leavetime: datetime,
                pickup: ride["location"]
            });
            }
        }
        $scope.drivers = mydrivers;
    };

    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    url = constants.BASE_SERVER_URL + "rides";
    req.get(url, success, err);
    
    
    $scope.chooseDriver = function() {
        $location.path('/app/rides/get/' + rideID);
    };
})
//http://54.86.175.74:8080/passengers/add/?direction=to&gcm_id=test&phone=504&name=test&__v=0
//http://54.86.175.74:8080/passengers/add/direction=Round%20Trip&gcm_id=dummy_id&phone=408&name=wasae&__v=0
.controller('GiveRideCtrl', function($scope, $ionicPopup, $timeout, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var tempID = $stateParams.rideId;
    //checkRider(input.name, input.phonenumber, input.location, input.numberseats, input.timeleaving, input.triptype)
    $scope.checkRider = function(name, phonenumber, location, seats, leaving, triptype) {      
        console.log(name);
        console.log(phonenumber);
        console.log(location);
        console.log(seats);
        console.log(leaving);
        console.log(triptype);
        url = constants.BASE_SERVER_URL + "passengers/add/" + "?direction=" + triptype + "&gcm_id=dummy_id&phone=" + phonenumber 
        + "&name=" + name + "&__v=0";  
        req.post(url, null, null);

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

.controller('DriverViewCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
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

.controller('RideListCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
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