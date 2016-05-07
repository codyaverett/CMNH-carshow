'use strict';

// Authentication service for user variables
angular.module('users').factory('Judges', ['Classes',
    function(Classes) {
        
        var strings = {
           carstrucks:[
            'Paint - Overall Paint Job',
            'Body & Exterior Modifications',
            'Engine Modifications',
            'Suspension/Undercarriage',
            'Wheels & Tires',
            'Interior Modifications',
            'Lamps & Brightwork',
            'Safety Equipment (Fire Extinguisher/FirstAid kit)'    
        ], motorcycles: [
            'Originality',
            'Wheels & Tires',
            'Paint',
            'Plating',
            'Electrical & Equipment',
            'Controls',
            'Cleanliness',
            'Engine & Transmission'
        ]};
           
        var isMotorcycle = function ( classString ) {
            
            var result = Classes.getClassNumber(classString);
            
            if( 1 == result || 20 == result || 21 == result || 22 == result )
                return true;
                     
            return false;
            
        };
        
        var isCarOrisTruck = function ( classString ) {
            
            var result = isMotorcycle( classString ); 
            
            if (result == false)
                return true;
            
            return false;
            
        }
        
        return {
            strings: strings,
            isMotorcycle: isMotorcycle,
            isCarOrisTruck: isCarOrisTruck
        }
         
    }
]);