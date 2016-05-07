'use strict';

// Authentication service for user variables
angular.module('users').factory('Authentication', ['$window',
  function ($window) {
    var auth = {
      user: $window.user,
      isDataEntry: function() { 
        return true;
         //console.log('is data entry');       
         /*if($window.user.roles) {
            if ($window.user.roles.find(function(e, i){
              if (e === "admin") {return true;}
            })); return true;
         } return false; */
      },
      generateUsername: function() {
        var text = "";
        var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";

        for( var i=0; i < 15; i++ )
            text += possible.charAt(Math.floor(Math.random() * possible.length));

        console.log("Generated Name gen_" + text);
        return text;
      }
    };

    return auth;
  }
]);
