'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	VehicleRegistration = mongoose.model('VehicleRegistration'),
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
	res.jsonp(req.vehicleRegistration);
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

exports.listPersonal = function(req, res) { 
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
	VehicleRegistration.findById(id).populate('user', 'displayName').exec(function(err, vehicleRegistration) {
		if (err) return next(err);
		if (! vehicleRegistration) return next(new Error('Failed to load Vehicle registration ' + id));
		req.vehicleRegistration = vehicleRegistration ;
		next();
	});
};

/**
 * Vehicle registration authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.vehicleRegistration.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
