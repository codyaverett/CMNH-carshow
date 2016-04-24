'use strict';

/**
 * Module dependencies
 */
var vehicleregistrationsPolicy = require('../policies/vehicleregistrations.server.policy'),
  vehicleregistrations = require('../controllers/vehicleregistrations.server.controller');

module.exports = function(app) {
  // Vehicleregistrations Routes
  app.route('/api/vehicleregistrations').all(vehicleregistrationsPolicy.isAllowed)
    .get(vehicleregistrations.list)
    .post(vehicleregistrations.create);

  app.route('/api/vehicleregistrations/:vehicleregistrationId').all(vehicleregistrationsPolicy.isAllowed)
    .get(vehicleregistrations.read)
    .put(vehicleregistrations.update)
    .delete(vehicleregistrations.delete);

  // Finish by binding the Vehicleregistration middleware
  app.param('vehicleregistrationId', vehicleregistrations.vehicleregistrationByID);
};
