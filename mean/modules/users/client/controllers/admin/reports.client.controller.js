'use strict';

angular.module('users.admin').controller('ReportsController', ['$scope', '$filter', 'Admin', '$state',
  function ($scope, $filter, Admin, $state) {
    
    $scope.users = {};
    $scope.judgeClassStructure = [];
    
    $scope.init = function() {
        
        //Getting all user data in $scope.users
        Admin.query(function (data) {
            $scope.users = data;
        });
        
        for(var i = 0; i < 22; i++){
            $scope.judgeClassStructure.push({entries: []});   
        }
        
        $scope.sortAllDataIntoBuckets();
    }
    
    $scope.sortAllDataIntoBuckets = function() {
        console.log("Sorting Data");
        //Switch case
    }
    
    $scope.pushToBucket = function(location, elem) {
    }
    
  }
]);
