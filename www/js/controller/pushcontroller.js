
var serverURL = 'http://54.86.175.74:8080/';
var tempUserID = '564ee19f6c2f1876527be562';
var senderId = '276638088511';

angular.module('PushModule', [])

.service('pushService', function( $cordovaPushV5, $cordovaDialogs, $localStorage, constants,  $cordovaMedia, $ionicPlatform, $http) {
    var notifications = [];
    var registerDisabled = false;
    console.log('Module setup');

    // Android Notification Received Handler
    function handleAndroid(notification) {
        console.log(JSON.stringify(notification));
        console.log("In foreground " + notification.additionalData.foreground  + " Coldstart " + notification.coldstart);

        $cordovaDialogs.alert(notification.message, "Push Notification Received");
        
        notifications.push(JSON.stringify(notification.message));
    }

    // TODO test this IOS Notification Received Handler
    function handleIOS(notification) {
        // The app was already open but we'll still show the alert and sound the tone received this way. If you didn't check
        // for foreground here it would make a sound twice, once when received in background and upon opening it from clicking
        // the notification when this code runs (weird).
        if (notification.foreground == '1') {
            // Play custom audio if a sound specified.
            if (notification.sound) {
                var mediaSrc = $cordovaMedia.newMedia(notification.sound);
                mediaSrc.promise.then($cordovaMedia.play(mediaSrc.media));
            }

            if (notification.body && notification.messageFrom) {
                $cordovaDialogs.alert(notification.body, notification.messageFrom);
            } else $cordovaDialogs.alert(notification.alert, 'Push Notification Received');

            if (notification.badge) {
                $cordovaPushV5.setBadgeNumber(notification.badge).then(function(result) {
                    console.log('Set badge success ' + result);
                }, function(err) {
                    console.log('Set badge error ' + err);
                });
            }
        }
        // Otherwise it was received in the background and reopened from the push notification. Badge is automatically cleared
        // in this case. You probably wouldn't be displaying anything at this point, this is here to show that you can process
        // the data in this situation.
        else {
            if (notification.body && notification.messageFrom) {
                $cordovaDialogs.alert(notification.body, '(RECEIVED WHEN APP IN BACKGROUND) ' + notification.messageFrom);
            } else $cordovaDialogs.alert(notification.alert, '(RECEIVED WHEN APP IN BACKGROUND) Push Notification Received');
        }
    }

    // Stores the device token in a db using node-pushserver (running locally in this case)
    //
    // type:  Platform type (ios, android etc)
    function storeDeviceToken(devToken) {
        console.log('Storing registration ID');
        window.localStorage.setItem('pushID', devToken);

        var tokenObj = {
            token: devToken,
            type: ionic.Platform.platform()
        };

        $http.post(serverURL + 'users/' + tempUserID + '/push',JSON.stringify(tokenObj))
            .success(function(data, status) {
                console.log('Token stored, device is successfully subscribed to receive push notifications.');
            })
            .error(function(data, status) {
                console.log('Error storing device token.' + data + ' ' + status);
            }
        );
    }

    // Removes the device token from the db via node-pushserver API unsubscribe (running locally in this case).
    // If you registered the same device with different userids, *ALL* will be removed. (It's recommended to register each
    // time the app opens which this currently does. However in many cases you will always receive the same device token as
    // previously so multiple userids will be created with the same token unless you add code to check).
    function removeDeviceToken() {

        var regId = window.localStorage.getItem("pushID");
        var tkn = {"token": regId};
        console.log("Storing registration ID");
        window.localStorage.removeItem("pushID");
        $http.delete(serverURL + "users/" + tempUserID+ "/push")
            .success(function (data, status) {
                console.log("Token removed, device is successfully unsubscribed and will not receive push notifications.");
            })
            .error(function (data, status) {
                console.log("Error removing device token." + data + " " + status)
            });
    }
  
    function init(){
        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
        var topics = [];
        if(mins){
            for(var i = 0; i < mins.length; i++){
               topics.push(mins[i]._id);
            }
            topics.push('global');
        }
        console.log("MINISITRYIDS push init" + JSON.stringify(topics));
        console.log("push init attempt start");
        var config = {
           "android": { "senderID"  : senderId,
                        "topics"    : topics},
           "ios": { "senderID": senderId,
                    "alert" : true, 
                    "badge" : true, 
                    "sound" : true,
                    "topics": topics}
        };

        if(typeof PushNotification !== "undefined" && PushNotification !== null){       
            var promise = $cordovaPushV5.initialize(config);
            console.log("promises" + typeof promise);
            return promise;
        }
        else{
            console.log("push notification not defined");
        }
        return null;
    };

    function registration() {
        console.log("registration handler set");

        $cordovaPushV5.register().then(function (result) {
            console.log("Register success " + result);

            registerDisabled = true;
            
            storeDeviceToken(result);
        }, function (err) {
            console.log("Register error " + err)
        });    
    };

    function setup() { 
        $cordovaPushV5.onNotification();
        $cordovaPushV5.onError();
    };
    // Unregister - Unregister your device token from APNS or GCM
    // ** Instead, just remove the device token from your db and stop sending notifications **
    function unreg() {
        console.log("Unregister called");
        removeDeviceToken();
        registerDisabled = false;

        //need to define options here, not sure what that needs to be but this is not recommended anyway
        $cordovaPushV5.unregister().then(function(result) {
            console.log('Unregister success ' + result);//
        }, function(err) {
            console.log('Unregister error ' + err);
        });
    };

    function onRecieved(event, notification) {
        console.log(JSON.stringify([notification]));
        if (ionic.Platform.isAndroid()) {
          handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
          handleIOS(notification);
          $scope.$apply(function () {
              $scope.notifications.push(JSON.stringify(notification.alert));
          })
        }
    };

    function onErr(event, error){
        console.log('$cordovaPushV5:errorOccurred ' + error);
    };

    var exports =  { 
    
        push_init : init,

        registration_setup : registration,

        push_setup : setup,

        unregister : unreg,

        onNotificationRecieved : onRecieved,

        onError : onErr
    };
    
    return exports;

});
