'use strict';

// Authentication service for user variables
angular.module('users').factory('Classes',
    function() {
        
        var strings = [
            'Mothers Only (Car or Truck)',
            'Mothers Only (Motorcycle)',
            'Cars Stock 1900-1971',
            'Cars Stock 1972-Present',
            'Cars Modified 1900-1971',
            'Cars Modified 1972-Present',
            'Cars Custom (All Years)',
            'Truck Stock 1900-1971',
            'Truck Stock 1972-Present',
            'Truck Modified 1900-1971',
            'Truck Modified 1972-Present',
            '4x4s',
            'Foreign Cars (All Years)',
            'Mustang',
            'Camaro',
            'Corvette',
            'Mopar Muscle',
            'Street Rod',
            'Tri-Fives',
            'Rat Rods',
            'Motorcycle Sport Bike',
            'Motorcycle Touring',
            'Motorcycle Custom'
           ];
           
           ///Get the number identifier for the class
            var getClassNumber = function( textIdentifier ) {
                
                for(var i = 0; i <= strings.length; i++){
                    if( textIdentifier == strings[i]) {
                        return i;
                    } 
                }
                console.log("Could not correlate class number");
            };
        
        return {
            strings: strings,
            getClassNumber: getClassNumber
        }
         
    }
);