var teams = angular.module('TeamCtrl', []);

teams.controller('TeamCtrl', function($scope, $location, req, constants, convenience) {
	var url = constants.BASE_SERVER_URL + 'ministryteam/list';
	
	var success = function(data) {
		$scope.teams = data.data;
	}

	var err = convenience.defaultErrorCallback('TeamsCtrl',
		'Could not retrieve list of minstry teams from server');

	req.get(url, success, err);

	$scope.viewDetails = function(id) {
		$location.path('/app/teams/' + id);
	}
})

.controller('TeamDetailCtrl', function($scope, $stateParams) {
	$scope.team = {name: 'My Team Name', description: "We do things together and we affect stuff. If you want to be a part of us please press on the join button below this chunk of filler text"}
	$scope.openInFacebook = function() {
		// the SRS says that if a user wants to join a team they do it by
		// opening a facebook link in inappbrowser, but none exists in db...
	}
});