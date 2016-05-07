'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'Users', 'userResolve', 'Classes', 'Judges',
  function ($scope, $state, Authentication, Users, userResolve, Classes, Judges) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    
    $scope.judgeCount = [0,1,2]; //How many judges
    //$scope.vehicles = VehiclesService.query(); //get vehicle data//This was used for showing Vehicle data on the user screens
    
    $scope.judges = Judges;

    $scope.togIsMotorcycle = $scope.judges.isMotorcycle($scope.user.class);

    $scope.toggle = function( input ) {
      //console.log(input);
      //console.log($scope.judges.isMotorcycle(input));
      //console.log($scope.judges.isCarOrisTruck(input));
      $scope.togIsMotorcycle = $scope.judges.isMotorcycle(input);
    };
            
    $scope.remove = function (user) {
      if (confirm('Are you sure you want to delete this user?')) {
        if (user) {
          user.$remove();

          $scope.users.splice($scope.users.indexOf(user), 1);
        } else {
          $scope.user.$remove(function () {
            $state.go('admin.users');
          });
        }
      }
    };
    
    $scope.signup = function (isValid) {
      $scope.error = null;
      
      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {

        // And redirect to the previous or home page
        $state.go('admin.users');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };    
  
    var user = new Users($scope.user);
    
    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      $scope.user.classID = Classes.getClassNumber($scope.user.class);

      user.$update(function () {
        $state.go('admin.users');
      }, function (errorResponse) {
        console.log(errorResponse.data.message);
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
