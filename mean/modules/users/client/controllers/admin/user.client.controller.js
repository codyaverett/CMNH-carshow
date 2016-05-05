'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'Users', 'userResolve',
  function ($scope, $state, Authentication, Users, userResolve) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    
    $scope.judgeCount = [0,1,2,3,4];
    
    console.log($scope.user);
    //$scope.vehicles = VehiclesService.query(); //get vehicle data//This was used for showing Vehicle data on the user screens

    //console.log($scope.user); I hate this project, so much.  Scrapping it for next year

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
      
      console.log("clicking>>?");
      
      $scope.user.judgepaint = [0,0,0,0,0];
      $scope.user.judgeextmods = [0,0,0,0,0];
      $scope.user.judgeenginemods = [0,0,0,0,0];
      $scope.user.judgesuspension = [0,0,0,0,0];
      $scope.user.judgewheels = [0,0,0,0,0];
      $scope.user.judgeinteriormods = [0,0,0,0,0];
      $scope.user.judgeaudiosecurity = [0,0,0,0,0];
      $scope.user.peoplechoice = 0;

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {

        // And redirect to the previous or home page
        $state.go('admin.users');
      }).error(function (response) {
        $scope.error = response.message;
      });
    };
    
    //var user = new Users($scope.user);
    $scope.update = function (isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      var user = $scope.user;

      console.log(user);

      user.$update(function () {
        $state.go('admin.users', {
          userId: user._id
        });
      }, function (errorResponse) {
        $scope.error = errorResponse.data.message;
      });
    };
  }
]);
