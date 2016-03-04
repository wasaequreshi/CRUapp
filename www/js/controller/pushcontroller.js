angular.module('PushModule', [])

.service('pushService', function( $q,$cordovaPushV5, $cordovaDialogs, $localStorage, constants,  $cordovaMedia, $ionicPlatform, $http, convenience) {
    
    var currentRegisteredTopics = [];
    var isHandlerSet = false;
    const PUSH_TKN_STORAGE_VAL = "pushId";
    // Android Notification Received Handler
    function handleAndroid(notification) {
        $cordovaDialogs.alert(notification.message, "Push Notification Received");
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
  
    /**
    * Get the configuation object that will be used notification initialization
    */
    function getConfigObject(topics){
        topics = !topics ? [] : topics;
        console.log("config Object" + JSON.stringify(topics));
        return {
           "android": { "senderID"  : constants.GCM_SENDER_ID,
                        "topics"    : topics},
           "ios": { "senderID": constants.GCM_SENDER_ID,
                    "alert" : true, 
                    "badge" : true, 
                    "sound" : true,
                    "topics": topics}
        };
    }

    /**
    * register the application to GCM
    **/
    function registerToGCM() {
        console.log("registration handler set");

        $cordovaPushV5.register().then(function (result) {
            console.log("Register success " + JSON.stringify(result));
            
            $localStorage.set(PUSH_TKN_STORAGE_VAL, result);
        }, function (err) {
            console.log("Register error " + err);
        });
    };

    /**
    * Set up listeners for the PushNotification library
    */
    function setupLibListeners(){
        $cordovaPushV5.onNotification();
        $cordovaPushV5.onError();  
    }

    /**
    * initialize the Push Notifications for the application
    */
    function init(){
        var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
        var topics = [];
        topics.push('global');
        if(mins){
            for(var i = 0; i < mins.length; i++){
               topics.push(mins[i]._id);
            }
        }
        
        var config = getConfigObject(topics);

        if(typeof PushNotification !== "undefined" && PushNotification !== null) {
            //when we are done initializing, regisyer to GCM and set uo listeners     
            var promise = $cordovaPushV5.initialize(config).then(function(){
                currentRegisteredTopics = topics;
                if(!isHandlerSet){
                    registerToGCM();
                    setupLibListeners();
                    isHandlerSet = true;
                }
            });
            
            return promise;
        }
        else{ //statement should not be reached unless under dev environment
            console.log("CordovaV5: push notification not available");
        }
        return null;
    };


    /*
    * Unregister to specific GCM topics 
    * @param topics array of topics to unregister from
    */
    function unregisterTopics(topics) {
        var prom = $q.defer();
        if (!topics || topics.length == 0){
            prom.reject("invalid topics");
            return prom.promise;
        }
        

        prom = $cordovaPushV5.unregister(topics).then(function(result) {
            isHandlerSet = false;
        }, function(err) {
            console.log('Unregister error ' + JSON.stringify(err));
        });

        return prom;
    };

    /**
    * Register to GCM topics
    */
    function registerTopics(topics) {
        if(!topics) {
            return;
        }

        topics.push('global');
        

        var unregisterList = [];
        for (var i = 0; i < currentRegisteredTopics.length; i++){

            if(!convenience.contains(currentRegisteredTopics[i], topics)){
                unregisterList.push(currentRegisteredTopics[i]);
            }
        }

        unregisterTopics(unregisterList);
       // .then(function(){

            var config = getConfigObject(topics);
            //console.log("SUCCESS TOPICS SUBSCRIBING TO registerTopics" + JSON.stringify(topics));

            if(typeof PushNotification !== "undefined" && PushNotification !== null){  
                /**
                * unfortunately th plugin is not set to allow the use of a register topics method so instead the 
                * initialize() method must be used
                */     
                $cordovaPushV5.initialize(config).then(
                    function(){
                        setupLibListeners();
                    }, 
                    function(){
                        console.log("ERROR WITH NEW TOPICS");
                    }
                );
                currentRegisteredTopics = topics;
            }
            else{// should not reach this unless in dev environment
                console.log("CordovaV5: push notification not available");
            }

    }

    /**
    *This function is invoked when a push notiification is recieved by the application
    */
    function onRecieved(event, notification) {
        console.log("$cordovaPushV5: GOT NOTIFICATION:" + JSON.stringify(notification));
        if (ionic.Platform.isAndroid()) {
          handleAndroid(notification);
        }
        else if (ionic.Platform.isIOS()) {
          handleIOS(notification);
        }
    };

    /**
    * This function is invoked when there is an error getting push notification
    */
    function onErr(event, error){
        console.log('$cordovaPushV5:errorOccurred ' + error);
    };

    /**
    *This function gets the Token from the push service
    **/
    function getToken() {
        return $localStorage.get(PUSH_TKN_STORAGE_VAL);
    }

    var exports =  { 
    
        push_init : init,

        onNotificationRecieved : onRecieved,

        onError : onErr,

        getToken : getToken,

        registerTopics : registerTopics,

    };

    return exports;

});
