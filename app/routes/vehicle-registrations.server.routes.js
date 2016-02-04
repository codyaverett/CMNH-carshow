'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var vehicleRegistrations = require('../../app/controllers/vehicle-registrations.server.controller');

	// Vehicle registrations Routes
	app.route('/vehicle-registrations')
		.get(vehicleRegistrations.list)
		.post(users.requiresLogin, vehicleRegistrations.create);

	app.route('/vehicle-registrations/:vehicleRegistrationId')
		.get(vehicleRegistrations.read)
		.put(users.requiresLogin, vehicleRegistrations.hasAuthorization, vehicleRegistrations.update)
		.delete(users.requiresLogin, vehicleRegistrations.hasAuthorization, vehicleRegistrations.delete);

	// Finish by binding the Vehicle registration middleware
	app.param('vehicleRegistrationId', vehicleRegistrations.vehicleRegistrationByID);
};
