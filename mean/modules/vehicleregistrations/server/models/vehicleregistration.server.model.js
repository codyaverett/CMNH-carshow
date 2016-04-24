'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Vehicleregistration Schema
 */
var VehicleregistrationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Vehicleregistration name',
    trim: true
  },
  created: {
    type: Date,
    default: Date.now
  },
  user: {
    type: Schema.ObjectId,
    ref: 'User'
  }
});

mongoose.model('Vehicleregistration', VehicleregistrationSchema);
