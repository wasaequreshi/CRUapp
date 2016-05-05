var teams = angular.module('TeamCtrl', []);

teams.controller('TeamCtrl', function($scope, $location, api, constants, convenience, $localStorage) {
	var mins = $localStorage.getObject(constants.CAMPUSES_CONFIG).ministries;
    
	var success = function(data) {
		$scope.teams = data.data;
	};

	var err = convenience.defaultErrorCallback('TeamsCtrl',
		'Could not retrieve list of minstry teams from server');

    if (mins === '' || mins === [] || typeof mins === 'undefined') {
        api.getAllTeams(success, err);
    }
    else {
        var minsIds = [];
        for (var i = 0; i < mins.length; i++) {
            minsIds.push(mins[i]._id);
        }
        
        var queryParam = {
            parentMinistry: {$in: minsIds}
        };
        
        //query for teams only in the ministry the user is subscribed to
        api.getMinistryTeams(queryParam, success, err);
    }

	$scope.viewDetails = function(id) {
		$location.path('/app/teams/' + id);
	};
})

.controller('TeamDetailCtrl', function($scope, $stateParams, constants, api, convenience) {
    var teamId = $stateParams.id;
    
    var err = convenience.defaultErrorCallback('TeamDetailCtrl',
		'Could not retrieve the selected minstry team from the server');
    
    var minSuccess = function(data) {
        var min = data.data;
        $scope.min = min.name;
    };
    
    var leaderUrl = constants.BASE_SERVER_URL + 'users/';
    var leaderSuccess = function(data) {
        var leader = data.data;
        $scope.leader = leader.name;
    };
    
    var success = function(data) {
        var team = data.data;
        var image = team.leadersImage;
        
        //no leader image
        if (!image) {
            //no leader image (DB has two values for the same thing)
            if (!team.image) {
                image = constants.PERSON_IMAGE;
            }
            else {
                image = team.image.url;
            }
        }
        else {
            image = image.url;
        }
            
        $scope.team = {
            name: team.name,
            description: team.description,
            url: image
        };
 
        api.getMinistry(team.parentMinistry, minSuccess, err);
    };
    
    api.getTeam(teamId, success, err);
    
	$scope.openInFacebook = function() {
		// the SRS says that if a user wants to join a team they do it by
		// opening a facebook link in inappbrowser, but none exists in db...
	};
});