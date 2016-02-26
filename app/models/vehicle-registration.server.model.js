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
		//required: 'Please fill Vehicle registration name',
		trim: true
	},
    type: {
        type: String,
        default: '',
        //required: 'Please fill the Vehicle Type',
        trim: true
    },
    year: {
        type: Number,
        //required: 'Please fill in the Vehicle Year',
        trim: true 
    },
    make: {
        type: String,
        //required: 'Please fill in the Vehicle Make',
        trim: true  
    },
    model: {
        type: String,
        //required: 'Please fill in the Vehicle Model',
        trim: true
    },
    mods: {
        type: String,
        //required: 'Please fill in the Vehicle Mods'  
    },
    previouslyParticipated: {
        type: Boolean  
    },
    postPictures: {
        type: Boolean  
    },
    class: {
        type: String,
        //required: 'Please choose a Vehicle Class'  
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