'use strict';

//Vehicle registrations service used to communicate Vehicle registrations REST endpoints
angular.module('vehicle-registrations').factory('VehicleRegistrations', ['$resource',
	function($resource) {
		return $resource('vehicle-registrations/:vehicleRegistrationId', { vehicleRegistrationId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);