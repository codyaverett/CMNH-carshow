'use strict';

/**
 * Module dependencies
 */
var acl = require('acl');

// Using the memory backend
acl = new acl(new acl.memoryBackend());

/**
 * Invoke Vehicle registrations Permissions
 */
exports.invokeRolesPolicies = function () {
  acl.allow([{
    roles: ['admin'],
    allows: [{
      resources: '/api/vehicle-registrations',
      permissions: '*'
    }, {
      resources: '/api/vehicle-registrations/:vehicleRegistrationId',
      permissions: '*'
    }]
  }, {
    roles: ['user'],
    allows: [{
      resources: '/api/vehicle-registrations',
      permissions: ['get', 'post']
    }, {
      resources: '/api/vehicle-registrations/:vehicleRegistrationId',
      permissions: ['get']
    }]
  }, {
    roles: ['guest'],
    allows: [{
      resources: '/api/vehicle-registrations',
      permissions: ['get']
    }, {
      resources: '/api/vehicle-registrations/:vehicleRegistrationId',
      permissions: ['get']
    }]
  }]);
};

/**
 * Check If Vehicle registrations Policy Allows
 */
exports.isAllowed = function (req, res, next) {
  var roles = (req.user) ? req.user.roles : ['guest'];

  // If an Vehicle registration is being processed and the current user created it then allow any manipulation
  if (req.vehicleRegistration && req.user && req.vehicleRegistration.user && req.vehicleRegistration.user.id === req.user.id) {
    return next();
  }

  // Check for user roles
  acl.areAnyRolesAllowed(roles, req.route.path, req.method.toLowerCase(), function (err, isAllowed) {
    if (err) {
      // An authorization error occurred
      return res.status(500).send('Unexpected authorization error');
    } else {
      if (isAllowed) {
        // Access granted! Invoke next middleware
        return next();
      } else {
        return res.status(403).json({
          message: 'User is not authorized'
        });
      }
    }
  });
};
