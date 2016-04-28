'use strict';

/**
 * Module dependencies
 */
var dataPolicy = require('../policies/data.server.policy'),
  data = require('../controllers/data.server.controller');

module.exports = function(app) {
  // Data Routes
  app.route('/api/data').all(dataPolicy.isAllowed)
    .get(data.list)
    .post(data.create);

  app.route('/api/data/:datumId').all(dataPolicy.isAllowed)
    .get(data.read)
    .put(data.update)
    .delete(data.delete);

  // Finish by binding the Datum middleware
  app.param('datumId', data.datumByID);
};
