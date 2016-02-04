'use strict';

//Setting up route
angular.module('vehicle-registrations').config(['$stateProvider',
	function($stateProvider) {
		// Vehicle registrations state routing
		$stateProvider.
		state('listVehicleRegistrations', {
			url: '/vehicle-registrations',
			templateUrl: 'modules/vehicle-registrations/views/list-vehicle-registrations.client.view.html'
		}).
		state('createVehicleRegistration', {
			url: '/vehicle-registrations/create',
			templateUrl: 'modules/vehicle-registrations/views/create-vehicle-registration.client.view.html'
		}).
		state('viewVehicleRegistration', {
			url: '/vehicle-registrations/:vehicleRegistrationId',
			templateUrl: 'modules/vehicle-registrations/views/view-vehicle-registration.client.view.html'
		}).
		state('editVehicleRegistration', {
			url: '/vehicle-registrations/:vehicleRegistrationId/edit',
			templateUrl: 'modules/vehicle-registrations/views/edit-vehicle-registration.client.view.html'
		});
	}
]);