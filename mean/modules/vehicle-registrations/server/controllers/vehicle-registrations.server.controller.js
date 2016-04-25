'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  VehicleRegistration = mongoose.model('VehicleRegistration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Vehicle registration
 */
exports.create = function(req, res) {
  var vehicleRegistration = new VehicleRegistration(req.body);
  vehicleRegistration.user = req.user;

  vehicleRegistration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleRegistration);
    }
  });
};

/**
 * Show the current Vehicle registration
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var vehicleRegistration = req.vehicleRegistration ? req.vehicleRegistration.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  vehicleRegistration.isCurrentUserOwner = req.user && vehicleRegistration.user && vehicleRegistration.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(vehicleRegistration);
};

/**
 * Update a Vehicle registration
 */
exports.update = function(req, res) {
  var vehicleRegistration = req.vehicleRegistration ;

  vehicleRegistration = _.extend(vehicleRegistration , req.body);

  vehicleRegistration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleRegistration);
    }
  });
};

/**
 * Delete an Vehicle registration
 */
exports.delete = function(req, res) {
  var vehicleRegistration = req.vehicleRegistration ;

  vehicleRegistration.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleRegistration);
    }
  });
};

/**
 * List of Vehicle registrations
 */
exports.list = function(req, res) { 
  VehicleRegistration.find().sort('-created').populate('user', 'displayName').exec(function(err, vehicleRegistrations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleRegistrations);
    }
  });
};

/**
 * Vehicle registration middleware
 */
exports.vehicleRegistrationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vehicle registration is invalid'
    });
  }

  VehicleRegistration.findById(id).populate('user', 'displayName').exec(function (err, vehicleRegistration) {
    if (err) {
      return next(err);
    } else if (!vehicleRegistration) {
      return res.status(404).send({
        message: 'No Vehicle registration with that identifier has been found'
      });
    }
    req.vehicleRegistration = vehicleRegistration;
    next();
  });
};
