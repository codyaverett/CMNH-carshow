'use strict';

/**
 * Module dependencies
 */
var vehicleRegistrationsPolicy = require('../policies/vehicle-registrations.server.policy'),
  vehicleRegistrations = require('../controllers/vehicle-registrations.server.controller');

module.exports = function(app) {
  // Vehicle registrations Routes
  app.route('/api/vehicle-registrations').all(vehicleRegistrationsPolicy.isAllowed)
    .get(vehicleRegistrations.list)
    .post(vehicleRegistrations.create);

  app.route('/api/vehicle-registrations/:vehicleRegistrationId').all(vehicleRegistrationsPolicy.isAllowed)
    .get(vehicleRegistrations.read)
    .put(vehicleRegistrations.update)
    .delete(vehicleRegistrations.delete);

  // Finish by binding the Vehicle registration middleware
  app.param('vehicleRegistrationId', vehicleRegistrations.vehicleRegistrationByID);
};
