'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema;

/**
 * Vehicle registration Schema
 */
var VehicleRegistrationSchema = new Schema({
  name: {
    type: String,
    default: '',
    required: 'Please fill Vehicle registration name',
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

mongoose.model('VehicleRegistration', VehicleRegistrationSchema);
