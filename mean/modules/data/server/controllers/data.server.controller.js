'use strict';

/**
 * Module dependencies.
 */
var path = require('path'),
  mongoose = require('mongoose'),
  Datum = mongoose.model('Datum'),
  errorHandler = require(path.resolve('./modules/core/server/controllers/errors.server.controller')),
  _ = require('lodash');

/**
 * Create a Datum
 */
exports.create = function(req, res) {
  var datum = new Datum(req.body);
  datum.user = req.user;

  datum.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datum);
    }
  });
};

/**
 * Show the current Datum
 */
exports.read = function(req, res) {
  // convert mongoose document to JSON
  var datum = req.datum ? req.datum.toJSON() : {};

  // Add a custom field to the Article, for determining if the current User is the "owner".
  // NOTE: This field is NOT persisted to the database, since it doesn't exist in the Article model.
  datum.isCurrentUserOwner = req.user && datum.user && datum.user._id.toString() === req.user._id.toString() ? true : false;

  res.jsonp(datum);
};

/**
 * Update a Datum
 */
exports.update = function(req, res) {
  var datum = req.datum ;

  datum = _.extend(datum , req.body);

  datum.save(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datum);
    }
  });
};

/**
 * Delete an Datum
 */
exports.delete = function(req, res) {
  var datum = req.datum ;

  datum.remove(function(err) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(datum);
    }
  });
};

/**
 * List of Data
 */
exports.list = function(req, res) { 
  Datum.find().sort('-created').populate('user', 'displayName').exec(function(err, data) {
    if (err) {
      return res.status(400).send({
        message: errorHandler.getErrorMessage(err)
      });
    } else {
      res.jsonp(data);
    }
  });
};

/**
 * Datum middleware
 */
exports.datumByID = function(req, res, next, id) {

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).send({
      message: 'Datum is invalid'
    });
  }

  Datum.findById(id).populate('user', 'displayName').exec(function (err, datum) {
    if (err) {
      return next(err);
    } else if (!datum) {
      return res.status(404).send({
        message: 'No Datum with that identifier has been found'
      });
    }
    req.datum = datum;
    next();
  });
};
