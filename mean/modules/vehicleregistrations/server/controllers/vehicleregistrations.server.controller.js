'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Vehicleregistration = mongoose.model('Vehicleregistration'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Vehicleregistration
 */
exports.create = function(req, res) {
  var vehicleregistration = new Vehicleregistration(req.body);
  vehicleregistration.user = req.user;

  vehicleregistration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleregistration);
    }
  });
};

/**
 * Show the current Vehicleregistration
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var vehicleregistration = req.vehicleregistration ? req.vehicleregistration.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  vehicleregistration.isCurrentUserOwner = req.user && vehicleregistration.user && vehicleregistration.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(vehicleregistration);
};

/**
 * Update a Vehicleregistration
 */
exports.update = function(req, res) {
  var vehicleregistration = req.vehicleregistration ;

  vehicleregistration = _.extend(vehicleregistration , req.body);

  vehicleregistration.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleregistration);
    }
  });
};

/**
 * Delete an Vehicleregistration
 */
exports.delete = function(req, res) {
  var vehicleregistration = req.vehicleregistration ;

  vehicleregistration.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleregistration);
    }
  });
};

/**
 * List of Vehicleregistrations
 */
exports.list = function(req, res) { 
  Vehicleregistration.find().sort('-created').populate('user', 'displayName').exec(function(err, vehicleregistrations) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(vehicleregistrations);
    }
  });
};

/**
 * Vehicleregistration middleware
 */
exports.vehicleregistrationByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Vehicleregistration is invalid'
    });
  }

  Vehicleregistration.findById(id).populate('user', 'displayName').exec(function (err, vehicleregistration) {
    if (err) {
      return next(err);
    } else if (!vehicleregistration) {
      return res.status(404).send({
        message: 'No Vehicleregistration with that identifier has been found'
      });
    }
    req.vehicleregistration = vehicleregistration;
    next();
  });
};
