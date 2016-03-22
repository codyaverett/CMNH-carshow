'use strict';

// Vehicle registrations controller
angular.module('vehicle-registrations').controller('VehicleRegistrationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'VehicleRegistrations',
	function($scope, $stateParams, $location, Authentication, VehicleRegistrations) {
		$scope.authentication = Authentication;

		// Create new Vehicle registration
		$scope.create = function() {
			// Create new Vehicle registration object
			var vehicleRegistration = new VehicleRegistrations ({
				name: this.vehicleRegistration.name,
                type: this.vehicleRegistration.type,
                year: this.vehicleRegistration.year,
                make: this.vehicleRegistration.make,
                model: this.vehicleRegistration.model,
                mods: this.vehicleRegistration.mods,
                class: this.vehicleRegistration.class
			});

			// Redirect after save
			vehicleRegistration.$save(function(response) {
				$location.path('vehicle-registrations');

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Vehicle registration
		$scope.remove = function(vehicleRegistration) {
			if ( vehicleRegistration ) { 
				vehicleRegistration.$remove();

				for (var i in $scope.vehicleRegistrations) {
					if ($scope.vehicleRegistrations [i] === vehicleRegistration) {
						$scope.vehicleRegistrations.splice(i, 1);
					}
				}
			} else {
				$scope.vehicleRegistration.$remove(function() {
					$location.path('vehicle-registrations');
				});
			}
		};

		// Update existing Vehicle registration
		$scope.update = function() {
			var vehicleRegistration = $scope.vehicleRegistration;

			vehicleRegistration.$update(function() {
				$location.path('vehicle-registrations');
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Vehicle registrations
		$scope.find = function() {
			$scope.vehicleRegistrations = VehicleRegistrations.query();
        };

		// Find existing Vehicle registration
		$scope.findOne = function() {
			$scope.vehicleRegistration = VehicleRegistrations.get({ 
				vehicleRegistrationId: $stateParams.vehicleRegistrationId
			});
		}
        
        $scope.anyPersonalVehicles = function() {
            
            if(!$scope.vehicleRegistrations.$resolved || $scope.vehicleRegistrations.length) {
                
                for(var i = 0; i < $scope.vehicleRegistrations.length; i++) {
                    if ($scope.authentication.user._id === $scope.vehicleRegistrations[i].user._id) {
                        return true;
                    }
                } 
            } else {
                return false;
            } 
            
        }
	}
]);