describe("pushService test", function() {
      var pushService;
      var localStorage;
      var cordovaDialogs;

      beforeEach(angular.mock.module("PushModule"));
      beforeEach(angular.mock.module('ngCordovaMocks'));
      beforeEach(angular.mock.module('CruMocks'));
      beforeEach(function(){
         angular.module('constants', []);
         angular.module('convenience', []);
                  
         angular.mock.module(function($provide){
            $provide.service('constants', function(){});
            $provide.service('convenience', function(){});
         });
         //set up global variable
         PushNotification = {"lol":"ok"};

      });

      /**
      * notice the pushService underscores. Angular convention states that they are necessary for 
      * user defined servies
      */

      beforeEach(inject(function (_pushService_, $localStorage, $cordovaDialogs) {
         pushService = _pushService_;
         localStorage = $localStorage;
         cordovaDialogs = $cordovaDialogs;
      }));

      it("contains spec with an expectation", function() {
         expect(true).toBe(true);
      });
      
      it("initializes properly", function() {
         pushService.push_init();
      });

      it("gets no token if registration is not invoked", function() {
         expect(typeof pushService.getToken()).toBe('undefined');
      });

      it("gets correct token if it is stored in local storage", function() {
         var token = "PushTokenStored";
         localStorage.set("pushId", token);

         expect(pushService.getToken()).toBe(token);
      });
      
      it("reacts properly when a notification is recieved on android", function() {
      	ionic.Platform.isAndroid = function()
		{
			return true;
		};
		spyOn(cordovaDialogs,'alert');
		var title = "Title of notification";
		var message = "The body of the notificaiton";
		pushService.onNotificationRecieved({}, {
			title: title,
			message: message
		});         
		expect(cordovaDialogs.alert).toHaveBeenCalled();
		expect(cordovaDialogs.alert).toHaveBeenCalledWith(message, title);

      });

      it("reacts properly when a notification is recieved on ios", function(){
      	ionic.Platform.isIOS = function()
		{
			return true;
		};
		
		//listen to the alert function
		spyOn(cordovaDialogs,'alert');
		var title = "Title of notification";
		var message = "The body of the notificaiton";

		pushService.onNotificationRecieved({}, {
			title: title,
			message: message
		});    

		// check to make sure the alert function is called     
		expect(cordovaDialogs.alert).toHaveBeenCalled();
		expect(cordovaDialogs.alert).toHaveBeenCalledWith(message, title);
      });
});
