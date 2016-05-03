'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user,
      isDataEntry: function() {
        if ($window.user.roles.find(function(e, i){
          if (e === "admin") {console.log("data entry user");return true;}
        })) return true;
        return false; 
      }
    };

    return auth;
  }
]);
