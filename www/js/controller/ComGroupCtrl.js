var groups = angular.module('ComGroupCtrl', []);

groups.controller('GroupCtrl', function($scope, $ionicModal, $location) {
    // populating with dummy data to be changed when the db actually contains these groups
    $scope.groups = [
        { _id: 1, leader: "Donald Trumpcard", time: "1pm - 4pm", days: "Mon, Wed, Fri" },
        { _id: 1, leader: "Cody Beers", time: "5pm - 8pm", days: "Mon, Wed, Fri" },
        { _id: 1, leader: "Willy Wonka", time: "8am - 11am", days: "Tues, Thurs" },
        { _id: 1, leader: "Codemaster Cody", time: "4pm - 6pm", days: "Mon, Tues, Wed, Thurs" },
        { _id: 1, leader: "Some Dude", time: "10am - 2pm", days: "Wed, Fri" },
        { _id: 1, leader: "Janet Jackson", time: "1pm - 4pm", days: "Mon, Wed, Fri" },
        { _id: 1, leader: "Giovanni Paulo Murillo", time: "9am - 12pm", days: "Tues, Fri" },
        { _id: 1, leader: "Katy Perry (dream gurl)", time: "10pm - 12am", days: "Mon, Tues, Wed, Thurs, Fri" },
    ];
    
    $scope.viewDetails = function(id) {
        console.log(id);
        $location.path('/app/groups/' + id);  
    };
    
    $ionicModal.fromTemplateUrl('templates/communitygroup/groupFilter.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.groupFilterModal = modal;
    });

    // Triggered in the modal to close it
    $scope.closeGroupFilterModal = function() {
        $scope.groupFilterModal.hide();
    };

    // Open the modal
    $scope.openGroupFilterModal = function() {
        $scope.groupFilterModal.show();
    };
    
    $scope.filterGroups = function() {
        // do stuff here  
    };
})

.controller('GroupDetailCtrl', function($scope, $stateParams, $ionicModal) {
    var id = $stateParams.id; // currently always 1, dummy data yay
    
    $scope.group = {
        _id: 1,
        leader: "Donald Trumpcard",
        time: "1pm - 4pm",
        days: "Mon, Wed, Fri",
        description: "This is the group where Donald Trump meets to indoctronize the people with fear mongering and other bad things. I hope you enjoyed my political commentary hidden deep with the depths of the CRU app. I'll be accepting applause later, thank you for your time"
    };
    
    $ionicModal.fromTemplateUrl('templates/communitygroup/groupSignup.html', {
        scope: $scope
    }).then(function(modal) {
        $scope.groupSignupModal = modal;
    });

    // Triggered in the modal to close it
    $scope.closeSignupModal = function() {
        $scope.groupSignupModal.hide();
    };

    // Open the modal
    $scope.openSignupModal = function() {
        $scope.groupSignupModal.show();
    };
    
    $scope.signupForGroup = function() {
        // do stuff here  
    };
});