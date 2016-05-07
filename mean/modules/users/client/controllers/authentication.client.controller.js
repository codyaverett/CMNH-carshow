'use strict';

angular.module('users').controller('AuthenticationController', ['$scope', '$state', '$http', '$location', '$window', 'Authentication', 'PasswordValidator', 'Classes',
  function ($scope, $state, $http, $location, $window, Authentication, PasswordValidator, Classes) {
    $scope.authentication = Authentication;
    $scope.popoverMsg = PasswordValidator.getPopoverMsg();

    // Get an eventual error defined in the URL query string:
    $scope.error = $location.search().err;
    $scope.isDataEntry = Authentication.isDataEntry;
    $scope.generateUsername = Authentication.generateUsername;
    
    // If user is signed in then redirect back home
    if ($scope.authentication.user && !$scope.isDataEntry() ) {
      $location.path('/');
    }
     
    $scope.signup = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $scope.credentials.username = $scope.generateUsername();

      $scope.credentials.judgepaint = [0,0,0,0,0];
      $scope.credentials.judgeextmods = [0,0,0,0,0];
      $scope.credentials.judgeenginemods = [0,0,0,0,0];
      $scope.credentials.judgesuspension = [0,0,0,0,0];
      $scope.credentials.judgewheels = [0,0,0,0,0];
      $scope.credentials.judgeinteriormods = [0,0,0,0,0];
      $scope.credentials.judgeaudiosecurity = [0,0,0,0,0];
      $scope.credentials.peoplechoice = 0;

      $scope.credentials.classID = Classes.getClassNumber($scope.credentials.class);

      $http.post('/api/auth/signup', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        if (!$scope.isDataEntry()) {
          $scope.authentication.user = response;
          $state.go('vehicles.create');
        } else {
          // And redirect to the previous or home page
          //$state.go($state.previous.state.name || 'home', $state.previous.params);
          $state.go('admin.users');  
        }
      }).error(function (response) {
        $scope.error = response.message;
      });
      
    };

    $scope.signin = function (isValid) {
      $scope.error = null;

      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'userForm');

        return false;
      }

      $http.post('/api/auth/signin', $scope.credentials).success(function (response) {
        // If successful we assign the response to the global user model
        $scope.authentication.user = response;

        // And redirect to the previous or home page
        $state.go($state.previous.state.name || 'home', $state.previous.params);
      }).error(function (response) {
        $scope.error = response.message;
      });
    };

    // OAuth provider request
    $scope.callOauthProvider = function (url) {
      if ($state.previous && $state.previous.href) {
        url += '?redirect_to=' + encodeURIComponent($state.previous.href);
      }

      // Effectively call OAuth authentication route:
      $window.location.href = url;
    };    
  }
]);
