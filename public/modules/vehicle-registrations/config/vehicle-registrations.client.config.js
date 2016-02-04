'use strict';

// Configuring the Articles module
angular.module('vehicle-registrations').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Vehicle registrations', 'vehicle-registrations', 'dropdown', '/vehicle-registrations(/create)?');
		Menus.addSubMenuItem('topbar', 'vehicle-registrations', 'List Vehicle registrations', 'vehicle-registrations');
		Menus.addSubMenuItem('topbar', 'vehicle-registrations', 'New Vehicle registration', 'vehicle-registrations/create');
	}
]);