
describe('CampusCtrl', function() {
	var scope;
	var ctrl;
	var httpBackend;
	var location;

	beforeEach(angular.mock.module("starter.controllers.camp"));
	beforeEach(angular.mock.module('CruMocks'));  

    beforeEach(inject(function($rootScope, $controller, $httpBackend, $location) {
	    scope = $rootScope.$new();
	    ctrl = $controller('CampusCtrl', {$scope: scope});
	    httpBackend = $httpBackend;
	    location = $location;
	}));


	angular.module('constants', []);
	      
	angular.mock.module(function($provide){
		$provide.service('constants', function(){});
	});


	it('has next label set correctly', function(){
    	expect(scope.next).toEqual('Select Ministries');
	});

	it('has title set correctly', function(){
    	expect(scope.title).toEqual('Select Campuses');
	});


	it('can change url when the user selects next', function(){

		spyOn(location, 'path');
		scope.choices = [{"_id":"563b04112930ae0300fbc096","slug":"cal-poly","name":"Cal Poly","__v":0,"url":"calpoly.edu","location":{"postcode":"93407","state":"California","suburb":"San Luis Obispo","street2":null,"street1":"1 Grand Ave","name":null,"number":null,"country":"United States"}},{"_id":"563b04532930ae0300fbc097","slug":"cuesta","name":"Cuesta","__v":0,"url":"cuesta.edu","location":{"postcode":"93403","state":"California","suburb":"San Luis Obispo","street1":"CA-1","country":"United States"}}];
		scope.goToNext();
		expect(location.path).toHaveBeenCalledWith('/app/ministries');
	})
});

describe('selectedCampuses', function() {

	var service;
	var choices;

	beforeEach(angular.mock.module("starter.controllers.camp"));

    beforeEach(inject(function(_selectedCampuses_) {
	    service = _selectedCampuses_;
	    choices = [{"_id":"563b04112930ae0300fbc096","slug":"cal-poly","name":"Cal Poly","__v":0,"url":"calpoly.edu","location":{"postcode":"93407","state":"California","suburb":"San Luis Obispo","street2":null,"street1":"1 Grand Ave","name":null,"number":null,"country":"United States"}},{"_id":"563b04532930ae0300fbc097","slug":"cuesta","name":"Cuesta","__v":0,"url":"cuesta.edu","location":{"postcode":"93403","state":"California","suburb":"San Luis Obispo","street1":"CA-1","country":"United States"}}];

	}));


	it("can get campuses properly", function(){
		service.setCampuses(choices);
		expect(service.getCampuses()).toEqual(choices);
	});

	it("can set campuses properly", function(){
		service.setCampuses(choices);
		expect(service.getCampuses()).toEqual(choices);
	});

	it("can return key value pairs of the campuses", function(){

		choicesAns = {"563b04112930ae0300fbc096":{
						"_id":"563b04112930ae0300fbc096",
						"slug":"cal-poly",
						"name":"Cal Poly",
						"__v":0,
						"url":"calpoly.edu",
						"location":{
							"postcode":"93407",
							"state":"California",
							"suburb":"San Luis Obispo",
							"street2":null,
							"street1":"1 Grand Ave",
							"name":null,
							"number":null,
							"country":"United States"
						}
					},
					"563b04532930ae0300fbc097":{
						"_id":"563b04532930ae0300fbc097",
						"slug":"cuesta",
						"name":"Cuesta",
						"__v":0,
						"url":"cuesta.edu",
						"location":{
							"postcode":"93403",
							"state":"California",
							"suburb":"San Luis Obispo",
							"street1":"CA-1",
							"country":"United States"
						}
					}
				};
		service.setCampuses(choices);
		object = service.getCampusesObject();
		expect(object).toEqual(choicesAns);

	})

});
