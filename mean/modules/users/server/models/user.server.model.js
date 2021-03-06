'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
  Schema = mongoose.Schema,
  crypto = require('crypto'),
  validator = require('validator'),
  generatePassword = require('generate-password'),
  owasp = require('owasp-password-strength-test');

/**
 * A Validation function for local strategy properties
 */
var validateLocalStrategyProperty = function (property) {
  return ((this.provider !== 'local' && !this.updated) || property.length);
};

/**
 * A Validation function for local strategy email
 */
var validateLocalStrategyEmail = function (email) {
  return ((this.provider !== 'local' && !this.updated) || validator.isEmail(email));
};

/**
 * A Validation function for local strategy password
 */
var validateLocalStrategyPassword = function(password) {
  return (this.provider !== 'local' || (password && password.length > 6));
};
/**
 * User Schema
 */
var UserSchema = new Schema({
  firstName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your first name']
  },
  lastName: {
    type: String,
    trim: true,
    default: '',
    validate: [validateLocalStrategyProperty, 'Please fill in your last name']
  },
  displayName: {
    type: String,
    trim: true
  },
  email: {
    type: String,
    trim: true
    //validate: [validateLocalStrategyProperty, 'Please fill in your email'],
    //match: [/.+\@.+\..+/, 'Please fill a valid email address']
  },
  emergencyContact: {
    type: String,
    trim: true
  },
  username: {
    type: String,
    unique: 'testing error message',
    required: 'Please fill in a username',
    trim: true
  },
  password: {
    type: String,
    default: 'carsbikesbbq'
    //validate: [validateLocalStrategyPassword, 'Password should be at least 6 characters']
  },
  phoneNumber: {
    type: String,
    validate: {
      validator: function(v) { 
        return /\d{9}/.test(v);
      },
      message: '{VALUE} is not a valid phone number!'
    }
    //required: [true, 'User phone number required']
  },
  address: {
    type: String
    //required: 'Please enter your Street Address'
  },
  city: {
    type: String
    //required: 'Please enter your City'
  },
  state: {
    type: String
    //required: 'Please choose your State'
  },
  zip: {
    type: Number
    //required: 'Please enter you Zip Code'
  },
  clubAffiliation: {
    type: String
  },
  previouslyParticipated: {
    type: Boolean
  },
  postPictures: {
    type: Boolean
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
    //  required: 'Please fill in the Vehicle Mods'  
  },
  class: {
     type: String, 
    // required: 'Please choose a Vehicle Class'  
  },
  classID: {
    type: Number
  },
  judgepaint: {
    type: [{
      type: Number
    }]
  },
  judgeextmods: {
    type: [{
      type: Number
    }]
  },
  judgeenginemods: {
    type: [{
      type: Number
    }]
  },
  judgesuspension: {
    type: [{
      type: Number
    }]
  },
  judgewheels: {
    type: [{
      type: Number
    }]
  },
  judgeinteriormods: {
    type: [{
      type: Number
    }]
  },
  judgelamps: {
    type: [{
      type: Number
    }]
  },
  judgesaftey: {
    type: [{
      type: Number
    }]
  },
  bjudgeoriginality: {
    type: [{
      type: Number
    }]
  },
  bjudgewheels: {
    type: [{
      type: Number  
    }]
  },
  bjudgepaint: {
    type: [{
      type: Number
    }]
  },
  bjudgeplating: {
    type: [{
      type: Number
    }]      
  },
  bjudgeelectrical: {
    type: [{
      type: Number
    }]    
  },
  bjudgecontrols: {
    type: [{
      type: Number
    }]    
  },
  bjudgecleanliness: {
    type: [{
      type: Number
    }]    
  },
  bjudgetransmission: {
    type: [{
      type: Number
    }]    
  },
  peoplechoice: {
    type: Number
  },
  hasPaid: {
      type: Boolean
  },
  registrationNumber: {
    type: Number,
    unique: 'testing error message'
  },
  preRegistered: {
    type: Boolean
  },  
  salt: {
    type: String
  },
  provider: {
    type: String,
    required: 'Provider is required'
  },
  providerData: {},
  additionalProvidersData: {},
  roles: {
    type: [{
      type: String,
      enum: ['user', 'admin']
    }],
    default: ['user']
  },
  updated: {
    type: Date
  },
  created: {
    type: Date,
    default: Date.now
  },
  /* For reset password */
  resetPasswordToken: {
    type: String
  },
  resetPasswordExpires: {
    type: Date
  }
});

/**
 * Hook a pre save method to hash the password
 */
UserSchema.pre('save', function (next) {
  if (this.password && this.isModified('password')) {
    this.salt = crypto.randomBytes(16).toString('base64');
    this.password = this.hashPassword(this.password);
  }

  next();
});

/**
 * Hook a pre validate method to test the local password
 */
UserSchema.pre('validate', function (next) {
  if (this.provider === 'local' && this.password && this.isModified('password')) {
    var result = owasp.test(this.password);
    if (result.errors.length) {
      var error = result.errors.join(' ');
      this.invalidate('password', error);
    }
  }

  next();
});

/**
 * Create instance method for hashing a password
 */
UserSchema.methods.hashPassword = function (password) {
  if (this.salt && password) {
    return crypto.pbkdf2Sync(password, new Buffer(this.salt, 'base64'), 10000, 64).toString('base64');
  } else {
    return password;
  }
};

/**
 * Create instance method for authenticating user
 */
UserSchema.methods.authenticate = function (password) {
  return this.password === this.hashPassword(password);
};

/**
 * Find possible not used username
 */
UserSchema.statics.findUniqueUsername = function (username, suffix, callback) {
  var _this = this;
  var possibleUsername = username.toLowerCase() + (suffix || '');

  _this.findOne({
    username: possibleUsername
  }, function (err, user) {
    if (!err) {
      if (!user) {
        callback(possibleUsername);
      } else {
        return _this.findUniqueUsername(username, (suffix || 0) + 1, callback);
      }
    } else {
      callback(null);
    }
  });
};

/**
* Generates a random passphrase that passes the owasp test.
* Returns a promise that resolves with the generated passphrase, or rejects with an error if something goes wrong.
* NOTE: Passphrases are only tested against the required owasp strength tests, and not the optional tests.
*/
UserSchema.statics.generateRandomPassphrase = function () {
  return new Promise(function (resolve, reject) {
    var password = '';
    var repeatingCharacters = new RegExp('(.)\\1{2,}', 'g');

    // iterate until the we have a valid passphrase. 
    // NOTE: Should rarely iterate more than once, but we need this to ensure no repeating characters are present.
    while (password.length < 20 || repeatingCharacters.test(password)) {
      // build the random password
      password = generatePassword.generate({
        length: Math.floor(Math.random() * (20)) + 20, // randomize length between 20 and 40 characters
        numbers: true,
        symbols: false,
        uppercase: true,
        excludeSimilarCharacters: true,
      });

      // check if we need to remove any repeating characters.
      password = password.replace(repeatingCharacters, '');
    }

    // Send the rejection back if the passphrase fails to pass the strength test
    if (owasp.test(password).errors.length) {
      reject(new Error('An unexpected problem occured while generating the random passphrase'));
    } else {
      // resolve with the validated passphrase
      resolve(password);
    }
  });
};

mongoose.model('User', UserSchema);
