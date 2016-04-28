'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Vehicle = mongoose.model('Vehicle'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vehicle;

/**
 * Vehicle routes tests
 */
describe('Vehicle CRUD tests', function () {

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

    // Save a user to the test db and create new Vehicle
    user.save(function () {
      vehicle = {
        name: 'Vehicle name'
      };

      done();
    });
  });

  it('should be able to save a Vehicle if logged in', function (done) {
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

        // Save a new Vehicle
        agent.post('/api/vehicles')
          .send(vehicle)
          .expect(200)
          .end(function (vehicleSaveErr, vehicleSaveRes) {
            // Handle Vehicle save error
            if (vehicleSaveErr) {
              return done(vehicleSaveErr);
            }

            // Get a list of Vehicles
            agent.get('/api/vehicles')
              .end(function (vehiclesGetErr, vehiclesGetRes) {
                // Handle Vehicle save error
                if (vehiclesGetErr) {
                  return done(vehiclesGetErr);
                }

                // Get Vehicles list
                var vehicles = vehiclesGetRes.body;

                // Set assertions
                (vehicles[0].user._id).should.equal(userId);
                (vehicles[0].name).should.match('Vehicle name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Vehicle if not logged in', function (done) {
    agent.post('/api/vehicles')
      .send(vehicle)
      .expect(403)
      .end(function (vehicleSaveErr, vehicleSaveRes) {
        // Call the assertion callback
        done(vehicleSaveErr);
      });
  });

  it('should not be able to save an Vehicle if no name is provided', function (done) {
    // Invalidate name field
    vehicle.name = '';

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

        // Save a new Vehicle
        agent.post('/api/vehicles')
          .send(vehicle)
          .expect(400)
          .end(function (vehicleSaveErr, vehicleSaveRes) {
            // Set message assertion
            (vehicleSaveRes.body.message).should.match('Please fill Vehicle name');

            // Handle Vehicle save error
            done(vehicleSaveErr);
          });
      });
  });

  it('should be able to update an Vehicle if signed in', function (done) {
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

        // Save a new Vehicle
        agent.post('/api/vehicles')
          .send(vehicle)
          .expect(200)
          .end(function (vehicleSaveErr, vehicleSaveRes) {
            // Handle Vehicle save error
            if (vehicleSaveErr) {
              return done(vehicleSaveErr);
            }

            // Update Vehicle name
            vehicle.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Vehicle
            agent.put('/api/vehicles/' + vehicleSaveRes.body._id)
              .send(vehicle)
              .expect(200)
              .end(function (vehicleUpdateErr, vehicleUpdateRes) {
                // Handle Vehicle update error
                if (vehicleUpdateErr) {
                  return done(vehicleUpdateErr);
                }

                // Set assertions
                (vehicleUpdateRes.body._id).should.equal(vehicleSaveRes.body._id);
                (vehicleUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Vehicles if not signed in', function (done) {
    // Create new Vehicle model instance
    var vehicleObj = new Vehicle(vehicle);

    // Save the vehicle
    vehicleObj.save(function () {
      // Request Vehicles
      request(app).get('/api/vehicles')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Vehicle if not signed in', function (done) {
    // Create new Vehicle model instance
    var vehicleObj = new Vehicle(vehicle);

    // Save the Vehicle
    vehicleObj.save(function () {
      request(app).get('/api/vehicles/' + vehicleObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', vehicle.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Vehicle with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/vehicles/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vehicle is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Vehicle which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Vehicle
    request(app).get('/api/vehicles/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Vehicle with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Vehicle if signed in', function (done) {
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

        // Save a new Vehicle
        agent.post('/api/vehicles')
          .send(vehicle)
          .expect(200)
          .end(function (vehicleSaveErr, vehicleSaveRes) {
            // Handle Vehicle save error
            if (vehicleSaveErr) {
              return done(vehicleSaveErr);
            }

            // Delete an existing Vehicle
            agent.delete('/api/vehicles/' + vehicleSaveRes.body._id)
              .send(vehicle)
              .expect(200)
              .end(function (vehicleDeleteErr, vehicleDeleteRes) {
                // Handle vehicle error error
                if (vehicleDeleteErr) {
                  return done(vehicleDeleteErr);
                }

                // Set assertions
                (vehicleDeleteRes.body._id).should.equal(vehicleSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Vehicle if not signed in', function (done) {
    // Set Vehicle user
    vehicle.user = user;

    // Create new Vehicle model instance
    var vehicleObj = new Vehicle(vehicle);

    // Save the Vehicle
    vehicleObj.save(function () {
      // Try deleting Vehicle
      request(app).delete('/api/vehicles/' + vehicleObj._id)
        .expect(403)
        .end(function (vehicleDeleteErr, vehicleDeleteRes) {
          // Set message assertion
          (vehicleDeleteRes.body.message).should.match('User is not authorized');

          // Handle Vehicle error error
          done(vehicleDeleteErr);
        });

    });
  });

  it('should be able to get a single Vehicle that has an orphaned user reference', function (done) {
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

          // Save a new Vehicle
          agent.post('/api/vehicles')
            .send(vehicle)
            .expect(200)
            .end(function (vehicleSaveErr, vehicleSaveRes) {
              // Handle Vehicle save error
              if (vehicleSaveErr) {
                return done(vehicleSaveErr);
              }

              // Set assertions on new Vehicle
              (vehicleSaveRes.body.name).should.equal(vehicle.name);
              should.exist(vehicleSaveRes.body.user);
              should.equal(vehicleSaveRes.body.user._id, orphanId);

              // force the Vehicle to have an orphaned user reference
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

                    // Get the Vehicle
                    agent.get('/api/vehicles/' + vehicleSaveRes.body._id)
                      .expect(200)
                      .end(function (vehicleInfoErr, vehicleInfoRes) {
                        // Handle Vehicle error
                        if (vehicleInfoErr) {
                          return done(vehicleInfoErr);
                        }

                        // Set assertions
                        (vehicleInfoRes.body._id).should.equal(vehicleSaveRes.body._id);
                        (vehicleInfoRes.body.name).should.equal(vehicle.name);
                        should.equal(vehicleInfoRes.body.user, undefined);

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
      Vehicle.remove().exec(done);
    });
  });
});
