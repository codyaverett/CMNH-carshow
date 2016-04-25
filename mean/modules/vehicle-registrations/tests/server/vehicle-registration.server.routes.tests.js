'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  VehicleRegistration = mongoose.model('VehicleRegistration'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vehicleRegistration;

/**
 * Vehicle registration routes tests
 */
describe('Vehicle registration CRUD tests', function () {

  before(function (done) {
    // Get application
    app = express.init(mongoose);
    agent = request.agent(app);

    done();
  });

  beforeEach(function (done) {
    // Create user credentials
    credentials = {
      username: 'username',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create a new user
    user = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'test@test.com',
      username: credentials.username,
      password: credentials.password,
      provider: 'local'
    });

    // Save a user to the test db and create new Vehicle registration
    user.save(function () {
      vehicleRegistration = {
        name: 'Vehicle registration name'
      };

      done();
    });
  });

  it('should be able to save a Vehicle registration if logged in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Vehicle registration
        agent.post('/api/vehicleRegistrations')
          .send(vehicleRegistration)
          .expect(200)
          .end(function (vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
            // Handle Vehicle registration save error
            if (vehicleRegistrationSaveErr) {
              return done(vehicleRegistrationSaveErr);
            }

            // Get a list of Vehicle registrations
            agent.get('/api/vehicleRegistrations')
              .end(function (vehicleRegistrationsGetErr, vehicleRegistrationsGetRes) {
                // Handle Vehicle registration save error
                if (vehicleRegistrationsGetErr) {
                  return done(vehicleRegistrationsGetErr);
                }

                // Get Vehicle registrations list
                var vehicleRegistrations = vehicleRegistrationsGetRes.body;

                // Set assertions
                (vehicleRegistrations[0].user._id).should.equal(userId);
                (vehicleRegistrations[0].name).should.match('Vehicle registration name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Vehicle registration if not logged in', function (done) {
    agent.post('/api/vehicleRegistrations')
      .send(vehicleRegistration)
      .expect(403)
      .end(function (vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
        // Call the assertion callback
        done(vehicleRegistrationSaveErr);
      });
  });

  it('should not be able to save an Vehicle registration if no name is provided', function (done) {
    // Invalidate name field
    vehicleRegistration.name = '';

    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Vehicle registration
        agent.post('/api/vehicleRegistrations')
          .send(vehicleRegistration)
          .expect(400)
          .end(function (vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
            // Set message assertion
            (vehicleRegistrationSaveRes.body.message).should.match('Please fill Vehicle registration name');

            // Handle Vehicle registration save error
            done(vehicleRegistrationSaveErr);
          });
      });
  });

  it('should be able to update an Vehicle registration if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Vehicle registration
        agent.post('/api/vehicleRegistrations')
          .send(vehicleRegistration)
          .expect(200)
          .end(function (vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
            // Handle Vehicle registration save error
            if (vehicleRegistrationSaveErr) {
              return done(vehicleRegistrationSaveErr);
            }

            // Update Vehicle registration name
            vehicleRegistration.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Vehicle registration
            agent.put('/api/vehicleRegistrations/' + vehicleRegistrationSaveRes.body._id)
              .send(vehicleRegistration)
              .expect(200)
              .end(function (vehicleRegistrationUpdateErr, vehicleRegistrationUpdateRes) {
                // Handle Vehicle registration update error
                if (vehicleRegistrationUpdateErr) {
                  return done(vehicleRegistrationUpdateErr);
                }

                // Set assertions
                (vehicleRegistrationUpdateRes.body._id).should.equal(vehicleRegistrationSaveRes.body._id);
                (vehicleRegistrationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Vehicle registrations if not signed in', function (done) {
    // Create new Vehicle registration model instance
    var vehicleRegistrationObj = new VehicleRegistration(vehicleRegistration);

    // Save the vehicleRegistration
    vehicleRegistrationObj.save(function () {
      // Request Vehicle registrations
      request(app).get('/api/vehicleRegistrations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Vehicle registration if not signed in', function (done) {
    // Create new Vehicle registration model instance
    var vehicleRegistrationObj = new VehicleRegistration(vehicleRegistration);

    // Save the Vehicle registration
    vehicleRegistrationObj.save(function () {
      request(app).get('/api/vehicleRegistrations/' + vehicleRegistrationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', vehicleRegistration.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Vehicle registration with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/vehicleRegistrations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vehicle registration is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Vehicle registration which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Vehicle registration
    request(app).get('/api/vehicleRegistrations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Vehicle registration with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Vehicle registration if signed in', function (done) {
    agent.post('/api/auth/signin')
      .send(credentials)
      .expect(200)
      .end(function (signinErr, signinRes) {
        // Handle signin error
        if (signinErr) {
          return done(signinErr);
        }

        // Get the userId
        var userId = user.id;

        // Save a new Vehicle registration
        agent.post('/api/vehicleRegistrations')
          .send(vehicleRegistration)
          .expect(200)
          .end(function (vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
            // Handle Vehicle registration save error
            if (vehicleRegistrationSaveErr) {
              return done(vehicleRegistrationSaveErr);
            }

            // Delete an existing Vehicle registration
            agent.delete('/api/vehicleRegistrations/' + vehicleRegistrationSaveRes.body._id)
              .send(vehicleRegistration)
              .expect(200)
              .end(function (vehicleRegistrationDeleteErr, vehicleRegistrationDeleteRes) {
                // Handle vehicleRegistration error error
                if (vehicleRegistrationDeleteErr) {
                  return done(vehicleRegistrationDeleteErr);
                }

                // Set assertions
                (vehicleRegistrationDeleteRes.body._id).should.equal(vehicleRegistrationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Vehicle registration if not signed in', function (done) {
    // Set Vehicle registration user
    vehicleRegistration.user = user;

    // Create new Vehicle registration model instance
    var vehicleRegistrationObj = new VehicleRegistration(vehicleRegistration);

    // Save the Vehicle registration
    vehicleRegistrationObj.save(function () {
      // Try deleting Vehicle registration
      request(app).delete('/api/vehicleRegistrations/' + vehicleRegistrationObj._id)
        .expect(403)
        .end(function (vehicleRegistrationDeleteErr, vehicleRegistrationDeleteRes) {
          // Set message assertion
          (vehicleRegistrationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Vehicle registration error error
          done(vehicleRegistrationDeleteErr);
        });

    });
  });

  it('should be able to get a single Vehicle registration that has an orphaned user reference', function (done) {
    // Create orphan user creds
    var _creds = {
      username: 'orphan',
      password: 'M3@n.jsI$Aw3$0m3'
    };

    // Create orphan user
    var _orphan = new User({
      firstName: 'Full',
      lastName: 'Name',
      displayName: 'Full Name',
      email: 'orphan@test.com',
      username: _creds.username,
      password: _creds.password,
      provider: 'local'
    });

    _orphan.save(function (err, orphan) {
      // Handle save error
      if (err) {
        return done(err);
      }

      agent.post('/api/auth/signin')
        .send(_creds)
        .expect(200)
        .end(function (signinErr, signinRes) {
          // Handle signin error
          if (signinErr) {
            return done(signinErr);
          }

          // Get the userId
          var orphanId = orphan._id;

          // Save a new Vehicle registration
          agent.post('/api/vehicleRegistrations')
            .send(vehicleRegistration)
            .expect(200)
            .end(function (vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
              // Handle Vehicle registration save error
              if (vehicleRegistrationSaveErr) {
                return done(vehicleRegistrationSaveErr);
              }

              // Set assertions on new Vehicle registration
              (vehicleRegistrationSaveRes.body.name).should.equal(vehicleRegistration.name);
              should.exist(vehicleRegistrationSaveRes.body.user);
              should.equal(vehicleRegistrationSaveRes.body.user._id, orphanId);

              // force the Vehicle registration to have an orphaned user reference
              orphan.remove(function () {
                // now signin with valid user
                agent.post('/api/auth/signin')
                  .send(credentials)
                  .expect(200)
                  .end(function (err, res) {
                    // Handle signin error
                    if (err) {
                      return done(err);
                    }

                    // Get the Vehicle registration
                    agent.get('/api/vehicleRegistrations/' + vehicleRegistrationSaveRes.body._id)
                      .expect(200)
                      .end(function (vehicleRegistrationInfoErr, vehicleRegistrationInfoRes) {
                        // Handle Vehicle registration error
                        if (vehicleRegistrationInfoErr) {
                          return done(vehicleRegistrationInfoErr);
                        }

                        // Set assertions
                        (vehicleRegistrationInfoRes.body._id).should.equal(vehicleRegistrationSaveRes.body._id);
                        (vehicleRegistrationInfoRes.body.name).should.equal(vehicleRegistration.name);
                        should.equal(vehicleRegistrationInfoRes.body.user, undefined);

                        // Call the assertion callback
                        done();
                      });
                  });
              });
            });
        });
    });
  });

  afterEach(function (done) {
    User.remove().exec(function () {
      VehicleRegistration.remove().exec(done);
    });
  });
});
