'use strict';

angular.module('users.admin').controller('ReportsController', ['$scope', '$filter', 'Admin', '$state', 'Classes', 'Judges',
  function ($scope, $filter, Admin, $state, Classes, Judges) {
    
    $scope.users = [];
    $scope.judgeClassStructure = [];
    
    $scope.misc = {};
    
    $scope.init = function() {
        
        //Getting all user data in $scope.users
        Admin.query(function (data) {
            $scope.users = data;
            
            $scope.users.forEach(function(current){
                console.log(current.registrationNumber);
                console.log(current.year);
                console.log(current.make);
                console.log(current.model);
                console.log(current.class);                
                console.log($scope.getTotalPoints(current));
                console.log("===================")
            });
            
            for(var i = 0; i <= 22; i++){
                $scope.judgeClassStructure.push({
                    class: Classes.strings[i],
                    classID: Classes.getClassNumber(Classes.strings[i]),
                    entries: $scope.getUsersForThisBucket(i)
                });
                             
            }
            
            $scope.getBestOfTheBest();
            $scope.getTopPeoplesChoice();
        });
 
    }
    
    $scope.getUsersForThisBucket = function( classID ) {
        console.log("Sorting Data");
        
        var matches = [];
        
        $scope.users.forEach(function( currentEntry, index) {
            //console.log(currentEntry);
            if(currentEntry.classID == classID) {
                currentEntry.totalPoints = $scope.getTotalPoints(currentEntry);
                matches.push(currentEntry);
            }
        });
        
        if(matches.length > 0) {
            console.log("Found Some...");
            //console.log(matches);
        }
        
        matches = $scope.getTop( 3, matches);
        
        return matches;
    };
    
    //Returns the total points depending on the class they are in
    //Pass it an entry and it will return the total  
    $scope.getTotalPoints = function( entry ) {
        var isCar = Judges.isCarOrisTruck(entry.class);
        var total = 0;
        
        if (isCar) {
            entry.judgepaint.forEach(function(val){
                total += val;
            });
            entry.judgeextmods.forEach(function(val){
                total += val;
            })
            entry.judgeenginemods.forEach(function(val){
                total += val;
            });
            entry.judgesuspension.forEach(function(val){
                total += val;
            });
            entry.judgewheels.forEach(function(val){
                total += val;
            });
            entry.judgeinteriormods.forEach(function(val){
                total += val; 
            });
            entry.judgelamps.forEach(function(val){
                total += val;
            });
            entry.judgesaftey.forEach(function(val){
                total += val;
            });
        } else {
            entry.bjudgeoriginality.forEach(function(val){
                total += val;
            });
            entry.bjudgewheels.forEach(function(val){
                total += val;
            })
            entry.bjudgepaint.forEach(function(val){
                total += val;
            });
            entry.bjudgeplating.forEach(function(val){
                total += val;
            });
            entry.bjudgeelectrical.forEach(function(val){
                total += val;
            });
            entry.bjudgecontrols.forEach(function(val){
                total += val; 
            });
            entry.bjudgecleanliness.forEach(function(val){
                total += val;
            });
            entry.bjudgetransmission.forEach(function(val){
                total += val;
            });
        }
        
        return total;
        
    };
    
    $scope.getTop = function( howMany, elements, what ) {

        elements.sort($scope.sort_by(what, true, parseInt));
        
        var ret = [];
        for(var i = 0; i < howMany; i++){
            ret.push(elements[i]);
        }
        
        return ret;
    };
    
    $scope.sort_by = function(field, reverse, primer){

        var key = primer ? 
            function(x) {return primer(x[field])} : 
            function(x) {return x[field]};

        reverse = !reverse ? 1 : -1;

        return function (a, b) {
            return a = key(a), b = key(b), reverse * ((a > b) - (b > a));
        } 
        
    };
    
    $scope.otherClasses = function() {
        
    }
    
    $scope.getTopPeoplesChoice = function( type ) {
        var matches = [];
        
        //Bikes
        $scope.users.forEach(function( currentEntry, index) {
            if(Judges.isMotorcycle(currentEntry.class)) {
                matches.push(currentEntry);
            }
        });
        $scope.getTop(1, matches, "peoplechoice");
        $scope.misc.bestMotorcyclePeople = matches[0];
        
        matches = [];
        //Car or Truck
        $scope.users.forEach(function( currentEntry, index) {
            if(Judges.isCarOrisTruck(currentEntry.class)) {
                matches.push(currentEntry);
            }
        });
        $scope.getTop(1, matches, "peoplechoice");
        $scope.misc.bestCarTruckPeople = matches[0];
 
        console.log("Best Car/Truck Peoples Choice!!");
        console.log($scope.misc.bestCarTruckPeople);
        console.log("Best Motorcycle Peoples Choice!!") 
        console.log($scope.misc.bestMotorcyclePeople);
 
    }
    
    $scope.getBestOfTheBest = function( type ) {
        
        var matches = [];
        
        //Bikes
        $scope.users.forEach(function( currentEntry, index) {
            if(Judges.isMotorcycle(currentEntry.class)) {
                currentEntry.totalPoints = $scope.getTotalPoints(currentEntry);
                matches.push(currentEntry);
            }
        });
        $scope.getTop(1, matches, "totalPoints");
        $scope.misc.bestMotorcycle = matches[0];
        
        
        var matches = [];
        //Cars Trucks
        $scope.users.forEach(function( currentEntry, index) {
            if(Judges.isCarOrisTruck(currentEntry.class)) {
                currentEntry.totalPoints = $scope.getTotalPoints(currentEntry);
                matches.push(currentEntry);
            }
        });
        $scope.getTop(1, matches, "totalPoints");
        $scope.misc.bestCarTruck = matches[0];

       console.log("Best Car/Truck!!");
       console.log($scope.misc.bestCarTruck);
       console.log("Best Motorcycle!!") 
       console.log($scope.misc.bestMotorcycle);
    }
    
    $scope.getBestClub = function() {
        //Can't Code this
        //Do some analysis on it
    }
    
/*People’s Choice – Car/Truck One Winner 
People’s Choice – Motorcycle One Winner 
Best Club Participation One Winner
Best of Show – Motorcycle One Winner
Best of Show – Car/Truck One Winner*/
    
  }
]);
