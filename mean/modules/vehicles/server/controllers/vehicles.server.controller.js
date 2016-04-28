'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vehicle = mongoose.model('Vehicle'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Vehicle
 */
exports.create = function(req, res) {
  var vehicle = new Vehicle(req.body);
  vehicle.user = req.user;

  vehicle.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicle);
    }
  });
};

/**
 * Show the current Vehicle
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var vehicle = req.vehicle ? req.vehicle.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  vehicle.isCurrentUserOwner = req.user && vehicle.user && vehicle.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(vehicle);
};

/**
 * Update a Vehicle
 */
exports.update = function(req, res) {
  var vehicle = req.vehicle ;

  vehicle = _.extend(vehicle , req.body);

  vehicle.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicle);
    }
  });
};

/**
 * Delete an Vehicle
 */
exports.delete = function(req, res) {
  var vehicle = req.vehicle ;

  vehicle.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicle);
    }
  });
};

/**
 * List of Vehicles
 */
exports.list = function(req, res) { 
  Vehicle.find().sort('-created').populate('user', 'displayName').exec(function(err, vehicles) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicles);
    }
  });
};

/**
 * Vehicle middleware
 */
exports.vehicleByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vehicle is invalid'
    });
  }

  Vehicle.findById(id).populate('user', 'displayName').exec(function (err, vehicle) {
    if (err) {
      return next(err);
    } else if (!vehicle) {
      return res.status(404).send({
        message: 'No Vehicle with that identifier has been found'
      });
    }
    req.vehicle = vehicle;
    next();
  });
};
