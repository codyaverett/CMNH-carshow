'use strict';

angular.module('users.admin').controller('UserController', ['$scope', '$state', 'Authentication', 'Users', 'userResolve', 'VehiclesService',
  function ($scope, $state, Authentication, Users, userResolve, VehiclesService) {
    $scope.authentication = Authentication;
    $scope.user = userResolve;
    $scope.vehicles = VehiclesService.query(); //get vehicle data

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
