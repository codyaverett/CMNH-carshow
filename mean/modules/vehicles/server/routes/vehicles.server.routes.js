'use strict';

/**
 * Module dependencies
 */
var vehiclesPolicy = require('../policies/vehicles.server.policy'),
  vehicles = require('../controllers/vehicles.server.controller');

module.exports = function(app) {
  // Vehicles Routes
  app.route('/api/vehicles').all(vehiclesPolicy.isAllowed)
    .get(vehicles.list)
    .post(vehicles.create);

  app.route('/api/vehicles/:vehicleId').all(vehiclesPolicy.isAllowed)
    .get(vehicles.read)
    .put(vehicles.update)
    .delete(vehicles.delete);

  // Finish by binding the Vehicle middleware
  app.param('vehicleId', vehicles.vehicleByID);
};
