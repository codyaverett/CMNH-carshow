'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user,
<<<<<<< HEAD
      isDataEntry: function() {        
       if($window.user.roles) {
          if ($window.user.roles.find(function(e, i){
            if (e === "admin") {return true;}
          })); return true;
       } return false; 
=======
      isDataEntry: function() {
        if ($window.user.roles.find(function(e, i){
          if (e === "admin") {console.log("data entry user");return true;}
        })) return true;
        return false; 
>>>>>>> d16b3dc8df63e4ebeec2420d4f13a611c1fede6a
      }
    };

    return auth;
  }
]);
