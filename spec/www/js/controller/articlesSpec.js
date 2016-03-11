
describe('articles controller', function() {
	var scope;
	var ctrl;
	var httpBackend;
	var location;
	
	beforeEach(angular.mock.module("articles"));
	beforeEach(angular.mock.module('CruMocks'));

	beforeEach(inject(function($rootScope, $controller, $httpBackend, $location) {
		scope = $rootScope.$new();
		ctrl = $controller('articles_controller', {
			$scope: scope,
			$cordovaInAppBrowser: {},
		});
		httpBackend = $httpBackend;
		location = $location;
	}));

	angular.module('constants', []);

	angular.mock.module(function($provide){
		$provide.service('constants', function(){});
	});


	it('can sort article lists', function(){
		expect(sortArticles([])).toEqual([]);
		expect(sortArticles([{date: 1}])).toEqual([{date: 1}]);
		expect(sortArticles([{date: 1}, {date: 2}])).toEqual([{date: 2}, {date: 1}]);
		expect(sortArticles([{date: 2}, {date: 1}])).toEqual([{date: 2}, {date: 1}]);
		expect(sortArticles([{date: 1}, {date: 2}, {date: 3}])).toEqual([{date: 3}, {date: 2}, {date: 1}]);
	});


	it('has title set correctly', function(){
		expect(scope.title).toEqual('Resource');
	});

});
