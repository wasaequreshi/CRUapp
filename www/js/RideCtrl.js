var ride = angular.module('starter.controllers.rides', ['starter.controllers.utils']);

//returns false if not in the array and true otherwise
var checkArr = function(item, arr) {
    for (var i = 0; i < arr.length; i++) {
        if (arr[i].rideId === item) {
            return i;
        }
    }
    
    return -1;
};

ride.controller('RidesCtrl', function($scope, $location, $ionicHistory, $ionicPopup, req, $localStorage, allEvents, constants) {
    //TO DO CHANGE URL
   /* url = $ajax.buildQueryUrl(constants.BASE_SERVER_URL + 'events', "mins", 
                                      mins);
    */
    
    //reload page everytime
    $scope.$on("$ionicView.enter", function () {
        var myrides = [];

        var success = function (data) {
 
        };

        var err = function(xhr, text, err) {
            //if there is an error (ie 404, 500, etc) redirect to the error page
            $location.path('/app/error');
        };

        url = constants.BASE_SERVER_URL + "ride";
        //req.get(url, success, err);
        
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        $scope.title = "Rides";
        myrides = allEvents.getEvents();

        //disable the buttons if already a driver/rider
        var isDriving;
        var isRiding;
        var index;

        //loop through the rides to see if currently driving or riding
        for (index = 0; index < myrides.length; ++index) {
            isDriving = false;
            isRiding = false;

            if (checkArr(myrides[index]._id, driving) != -1) {
                isDriving = true;
            }
            else if (checkArr(myrides[index]._id, riding) != -1) {
                isRiding = true;
            }

            //adding the button text for the event
            myrides[index].driving = isDriving;
            myrides[index].riding = isRiding;
        }

        $scope.rides = myrides;
    });
    
    $scope.goToRideData = function(tempID, isDriving) {

        if (!isDriving) {
            /* TODO: get from the server if this person is already a driver */
            var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);
            var isRider = checkArr(tempID, riding);            

            $localStorage.setObject(constants.SELECTED_RIDE, tempID);

            if (isRider != -1) {
                var driverID = riding[isRider].driverId;
                $location.path('/app/rides/' + tempID + '/driver/' + driverID);
            }
            else {
                $location.path('/app/rides/' + tempID + '/drivers');
            }
        } else {
            var myPopup = $ionicPopup.show({
                template: '<p>Sorry, but you cannot get a ride to an event if you are already signed up as a driver.</p>',
                title: '<b>You Cannot Ride and Drive</b>',
                scope: $scope,
                buttons: [
                  { text: 'Ok', type: 'button-balanced' },
                ]
            });
        }
    };

    $scope.goToDriveData = function(tempID, isRiding) {

        // if the user is already a rider, don't allow them to sign up to drive
        if (!isRiding) {
            var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            var isDriver = checkArr(tempID, driving);

            //if a driver for this event
            if (isDriver != -1) {
                $location.path('/app/drive/' + tempID + '/riders' + '/' + driving[isDriver].driverId);
            }
            else {
                $location.path('/app/drive/' + tempID);
            }
        } else {
            var myPopup = $ionicPopup.show({
                template: '<p>Sorry, but you cannot drive to an event if you are already signed up to be a rider</p>',
                title: '<b>You Cannot Drive and Ride</b>',
                scope: $scope,
                buttons: [
                  { text: 'Ok', type: 'button-balanced' },
                ]
            });
        }
    };
})

//form for signing up to be a rider
.controller('GetRideCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    var tempID = $stateParams.rideId;
    var driveId = $stateParams.driverId;
    
    $scope.getRide = function() {
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);

        if (typeof riding.length === "undefined" || riding.length === 0) {
            riding = [];
            riding.push({
                rideId: tempID,
                driverId: driveId
            });
        }
        else if (checkArr(tempID, riding) === -1) {
            riding.push({
                rideId: tempID,
                driverId: driveId
            });
        }
        
        $localStorage.setObject(constants.MY_RIDES_RIDER, riding);

        /* TODO: Add rider to database */

        $ionicHistory.goBack(constants.RIDER_SIGNUP_BACK_TO_START);
    };
})

//list of drivers to choose from 
.controller('ChooseDriverCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams, $ionicModal) {
    //id from the url
    var rideID = $stateParams.rideId;
    
    var mydrivers = [];
    
    $ionicModal.fromTemplateUrl('templates/rideSharing/filterModal.html', {
        scope: $scope,
        animation: 'slide-in-up'
      }).then(function(modal) {
        $scope.modal = modal
    })  

    $scope.openModal = function() {
        $scope.modal.show()
    }

    $scope.closeModal = function() {
        $scope.modal.hide();
    };

    $scope.$on('$destroy', function() {
        $scope.modal.remove();
    });
    
    $scope.filterRides = function(date) {
        
        var success = function(data) {
            var rides = data.data;
            
            /*TODO change mydrivers based on data given back*/
            
            $scope.drivers = mydrivers;
        };
        
        var err = function(xhr, text, err) {
            //if there is an error (ie 404, 500, etc) redirect to the error page
            $location.path('/app/error');
        };
        
        /*TODO: filter rides*/
        url = constants.BASE_SERVER_URL + "ride/list";
        //req.get(url, success, err);
        
        console.log(date);
    };
    
    var success = function (data) {
        var date;
        
        rides = data.data;
        selectedRide = $localStorage.getObject(constants.SELECTED_RIDE);
        for (var i = 0; i < rides.length; i++)
        {
            ride = rides[i];
            if (selectedRide === ride.event)
            {
                var locale = "en-us";

                var eventDate = new Date(ride.time);
                
                // check whether the date is am or pm
                var ampm = eventDate.getHours() >= 12 ? ' pm' : ' am';
                // format the time to be 12 hours. The || means if the time is 0 bc 24hr format, make it 12
                var time = (eventDate.getHours() % 12 || 12) + ":" + eventDate.getMinutes() + ampm;
                date = eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
                    + eventDate.getDate() + ', ' + eventDate.getFullYear();
                
                mydrivers.push({
                    id: ride._id,
                    event_id: ride.event, 
                    name: ride.driverName,
                    phone: ride.driverNumber,
                    time: time,
                    date: date,
                    pickup: ride.location
                });
            }
        }
        $scope.drivers = mydrivers;
    };

    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    url = constants.BASE_SERVER_URL + "ride/list";
    req.get(url, success, err);
    
    
    $scope.chooseDriver = function(driveId) {
        console.log(driveId);
        $location.path('/app/rides/' + rideID + '/get/' + driveId);
    };
})
//http://54.86.175.74:8080/passengers/add/?direction=to&gcm_id=test&phone=504&name=test&__v=0
//http://54.86.175.74:8080/passengers/add/direction=Round%20Trip&gcm_id=dummy_id&phone=408&name=wasae&__v=0
.controller('GiveRideCtrl', function($scope, $ionicPopup, $timeout, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var tempID = $stateParams.rideId;
    //checkRider(input.name, input.phonenumber, input.location, input.numberseats, input.timeleaving, input.triptype)
    $scope.checkRider = function(name, phonenumber, location, seats, leaving, triptype) {      
        
        //change the triptype to fit the server
        if (triptype === "One Way (from Event)") {
            triptype = "from";
        }
        else if (triptype === "One Way (to Event)") {
            triptype = "to";
        }
        else {
            triptype = "both";
        }
        
        //create the post call to create the driver in the DB
        var url = constants.BASE_SERVER_URL + "ride/create";
        var data = {
            gcm_id: "dummy_id",
            driverName: name,
            driverNumber: 11, 
            /* TODO fill in the location */
            //location: location,
            event: tempID,
            direction: triptype,
            seats: seats,
            time: leaving
        };
              
        
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
            var success = function(data) {
                var driveID = data.data.post._id;
                console.log("Drive ID: " + driveID);
                
                var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
            
                if (typeof driving.length === "undefined" || driving.length === 0) {
                    console.log("Not driving yet");
                    driving = [];
                    driving.push({
                        rideId: tempID,
                        driverId: driveID
                    });
                }
                else if (checkArr(tempID, driving) === -1) {
                    driving.push({
                        rideId: tempID,
                        driverId: driveID
                    });
                }

                $localStorage.setObject(constants.MY_RIDES_DRIVER, driving);
                
                $ionicHistory.goBack(constants.DRIVER_SIGNUP_BACK_TO_START);
            }

            var fail = function(data) {
                //if there is an error (ie 404, 500, etc) redirect to the error page
                $location.path('/app/error');
            }        
            
            req.post(url, data, success, fail);
        }
    };
    
})

.controller('DriverViewCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    var driverID = $stateParams.driverId;
    
    var success = function(data) {
        var driverInfo = data.data;
        
        var eventDate = new Date(driverInfo.time);
                
        // check whether the date is am or pm
        var ampm = eventDate.getHours() >= 12 ? ' pm' : ' am';
        // format the time to be 12 hours. The || means if the time is 0 bc 24hr format, make it 12
        var time = (eventDate.getHours() % 12 || 12) + ":" + eventDate.getMinutes() + ampm;
        var date = eventDate.toLocaleDateString(locale, { month: 'long' }) + ' '
            + eventDate.getDate() + ', ' + eventDate.getFullYear();
        
        var mydriver = {
            id: driverID,
            name: driverInfo.driverName,
            phone: "N/A",
            time: time + " " + ampm,
            date: date,
            pickup: driverInfo.location
        };

        $scope.driver = mydriver;
    }
    
    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };

    console.log("Driver: " + driverID);
    var url = constants.BASE_SERVER_URL + "ride/" + driverID;
    req.get(url, success, err);
    
    
    $scope.cancelRide = function() {
        var riding = $localStorage.getObject(constants.MY_RIDES_RIDER);
        var idx = checkArr(rideID, riding);
        if (idx != -1) {
            riding.splice(idx, 1);
            $localStorage.setObject(constants.MY_RIDES_RIDER, riding);
        }
        
        /* TODO: delete driver from database */
        /* TODO: (push) notify riders that the driver canceled */
        
        $ionicHistory.goBack(constants.DRIVER_VIEW_RIDERS_BACK_TO_START);
    };
   
})

.controller('RideListCtrl', function($scope, $location, $ionicHistory, req, $localStorage, allEvents, constants, $stateParams) {
    //id from the url
    var rideID = $stateParams.rideId;
    var driverID = $stateParams.driverId;
    
    
    /* TODO: Fill in with real data 
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
     });*/
    
    
    
    var success = function(data) {
        var myriders = [];
        var passengers = data.data.passengers;
        console.log(passengers);
        var passUrl = constants.BASE_SERVER_URL + "passenger/";
        var passSuccess = function(data) {
            var pass = data.data;
            
            myriders.push({
                name: pass.name,
                phone: pass.phone
            });
        }
        
        var passErr = function(data) {
            //do nothing for now
        }
        
        for (var idx = 0; idx < passengers.length; idx++) {
            req.get(passUrl + passengers[idx], passSuccess, passErr);
        }
        
        $scope.riders = myriders;
    };
    
    var err = function(xhr, text, err) {
        //if there is an error (ie 404, 500, etc) redirect to the error page
        $location.path('/app/error');
    };
    
    var url = constants.BASE_SERVER_URL + "ride/" + driverID;
    req.get(url, success, err);
    
    $scope.cancelRide = function() {
        var driving = $localStorage.getObject(constants.MY_RIDES_DRIVER);
        var idx = checkArr(rideID, driving);
        if (idx != -1) {
            driving.splice(idx, 1);
            $localStorage.setObject(constants.MY_RIDES_DRIVER, driving);
        }
        
        /* TODO: delete driver from database */
        /* TODO: (push) notify riders that the driver canceled */
        
        $ionicHistory.goBack(constants.DRIVER_VIEW_RIDERS_BACK_TO_START);
    };
   
});