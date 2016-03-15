'use strict';

// Vehicle registrations controller
angular.module('vehicle-registrations').controller('VehicleRegistrationsController', ['$scope', '$stateParams', '$location', 'Authentication', 'VehicleRegistrations',
	function($scope, $stateParams, $location, Authentication, VehicleRegistrations) {
		$scope.authentication = Authentication;

		// Create new Vehicle registration
		$scope.create = function() {
			// Create new Vehicle registration object
			var vehicleRegistration = new VehicleRegistrations ({
				name: this.name,
                type: this.type,
                year: this.year,
                make: this.make,
                model: this.model,
                mods: this.mods,
                class: this.class
			});

			// Redirect after save
			vehicleRegistration.$save(function(response) {
				$location.path('vehicle-registrations/');

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
				$location.path('vehicle-registrations/' + vehicleRegistration._id);
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
		};
	}
]);