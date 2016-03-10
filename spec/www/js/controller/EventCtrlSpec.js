describe('EventsCtrl', function() {
	var BASE_SERVER_URL = 'http://ec2-52-91-208-65.compute-1.amazonaws.com:3001/api/';
	var rootScope, scope, controller, location, httpBackend, constants,
		getList;

	// create a fake instance of EventCtrl to test
	beforeEach(angular.mock.module('EventCtrl'));
	// use some mock objects found commonly found throughout the app
	beforeEach(angular.mock.module('CruMocks'));

	// set up each of the variables so they are the same before each unit
	// tests runs. Inject the following objects into my fake EventCtrl
	// these are coming from default mock objects provided by angular itself
	beforeEach(inject(function($rootScope, $controller, $location, $httpBackend) {
	    // make new general angular components
	    rootScope = $rootScope;
	    scope = $rootScope.$new();
	    controller = function() {
	    	return $controller('EventsCtrl', {
		    	$scope: scope,
		    	$stateParams: {},
		    	$ionicHistory: {},
		    	$cordovaInAppBrowser: {},
		    	$cordovaCalendar: {},
		    	location: $location
		    });
	    };

	    location = $location;
	    httpBackend = $httpBackend;
	    getList = httpBackend.when('GET', BASE_SERVER_URL + 'event/list').respond([{test: 1, test: 2, test: 3}]);
	}));

	afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
   	});

	it('is not empty when no ministries have been chosen', function() {
		// because the events page is wrapped in a view enter event
		// must broadcast the event to ensure the code is run.
		httpBackend.expectGET(BASE_SERVER_URL + 'event/list');
		controller();
		rootScope.$broadcast('$ionicView.enter');
		httpBackend.flush();

		expect(scope.events.length).toBeGreaterThan(0);
	});

	it('navigates to the error page when 500 received', function() {
		getList.respond(500, '');
		httpBackend.expectGET(BASE_SERVER_URL + 'event/list');
		spyOn(location, 'path');

		controller();
		rootScope.$broadcast('$ionicView.enter');
		httpBackend.flush();

		expect(location.path).toHaveBeenCalledWith('/app/error');
	});

	it('navigates to the proper page', function() {
		httpBackend.expectGET(BASE_SERVER_URL + 'event/list');
		controller();
		rootScope.$broadcast('$ionicView.enter');
		httpBackend.flush();
		
		spyOn(location, 'path');
		
		var id = Math.random();
		scope.goToEvent(id);
		expect(location.path).toHaveBeenCalledWith('/app/events/' + id);
	});
});

describe('EventCtrl', function() {
	var BASE_SERVER_URL = 'http://ec2-52-91-208-65.compute-1.amazonaws.com:3001/api/';
	var rootScope, scope, controller, location, httpBackend, constants,
		getEvent;
	var id = 1;

	// create a fake instance of EventCtrl to test
	beforeEach(angular.mock.module('EventCtrl'));
	// use some mock objects found commonly found throughout the app
	beforeEach(angular.mock.module('CruMocks'));

	beforeEach(inject(function($rootScope, $controller, $location, $httpBackend) {
		rootScope = $rootScope;
		scope = $rootScope.$new();
		location = $location;
		httpBackend = $httpBackend;
		controller = function() {
			return $controller('EventCtrl', {
				$scope: scope,
		    	$stateParams: {
		    		eventId: id
		    	},
		    	$ionicHistory: {},
		    	$cordovaInAppBrowser: {},
		    	$cordovaCalendar: {},
		    	location: $location
			});
		};

		getEvent = httpBackend.when('GET', BASE_SERVER_URL + 'event/' + id).respond({test: 'test'});
	}));

	afterEach(function() {
    	httpBackend.verifyNoOutstandingExpectation();
    	httpBackend.verifyNoOutstandingRequest();
   	});

   	it('contains the event requested by the page', function() {
   		httpBackend.expectGET(BASE_SERVER_URL + 'event/' + id);
   		controller();
   		httpBackend.flush();

   		expect(scope.myEvent.test).toEqual('test');
   	});
});