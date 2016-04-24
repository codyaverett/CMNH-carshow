'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Vehicleregistration = mongoose.model('Vehicleregistration'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, vehicleregistration;

/**
 * Vehicleregistration routes tests
 */
describe('Vehicleregistration CRUD tests', function () {

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

    // Save a user to the test db and create new Vehicleregistration
    user.save(function () {
      vehicleregistration = {
        name: 'Vehicleregistration name'
      };

      done();
    });
  });

  it('should be able to save a Vehicleregistration if logged in', function (done) {
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

        // Save a new Vehicleregistration
        agent.post('/api/vehicleregistrations')
          .send(vehicleregistration)
          .expect(200)
          .end(function (vehicleregistrationSaveErr, vehicleregistrationSaveRes) {
            // Handle Vehicleregistration save error
            if (vehicleregistrationSaveErr) {
              return done(vehicleregistrationSaveErr);
            }

            // Get a list of Vehicleregistrations
            agent.get('/api/vehicleregistrations')
              .end(function (vehicleregistrationsGetErr, vehicleregistrationsGetRes) {
                // Handle Vehicleregistration save error
                if (vehicleregistrationsGetErr) {
                  return done(vehicleregistrationsGetErr);
                }

                // Get Vehicleregistrations list
                var vehicleregistrations = vehicleregistrationsGetRes.body;

                // Set assertions
                (vehicleregistrations[0].user._id).should.equal(userId);
                (vehicleregistrations[0].name).should.match('Vehicleregistration name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Vehicleregistration if not logged in', function (done) {
    agent.post('/api/vehicleregistrations')
      .send(vehicleregistration)
      .expect(403)
      .end(function (vehicleregistrationSaveErr, vehicleregistrationSaveRes) {
        // Call the assertion callback
        done(vehicleregistrationSaveErr);
      });
  });

  it('should not be able to save an Vehicleregistration if no name is provided', function (done) {
    // Invalidate name field
    vehicleregistration.name = '';

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

        // Save a new Vehicleregistration
        agent.post('/api/vehicleregistrations')
          .send(vehicleregistration)
          .expect(400)
          .end(function (vehicleregistrationSaveErr, vehicleregistrationSaveRes) {
            // Set message assertion
            (vehicleregistrationSaveRes.body.message).should.match('Please fill Vehicleregistration name');

            // Handle Vehicleregistration save error
            done(vehicleregistrationSaveErr);
          });
      });
  });

  it('should be able to update an Vehicleregistration if signed in', function (done) {
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

        // Save a new Vehicleregistration
        agent.post('/api/vehicleregistrations')
          .send(vehicleregistration)
          .expect(200)
          .end(function (vehicleregistrationSaveErr, vehicleregistrationSaveRes) {
            // Handle Vehicleregistration save error
            if (vehicleregistrationSaveErr) {
              return done(vehicleregistrationSaveErr);
            }

            // Update Vehicleregistration name
            vehicleregistration.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Vehicleregistration
            agent.put('/api/vehicleregistrations/' + vehicleregistrationSaveRes.body._id)
              .send(vehicleregistration)
              .expect(200)
              .end(function (vehicleregistrationUpdateErr, vehicleregistrationUpdateRes) {
                // Handle Vehicleregistration update error
                if (vehicleregistrationUpdateErr) {
                  return done(vehicleregistrationUpdateErr);
                }

                // Set assertions
                (vehicleregistrationUpdateRes.body._id).should.equal(vehicleregistrationSaveRes.body._id);
                (vehicleregistrationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Vehicleregistrations if not signed in', function (done) {
    // Create new Vehicleregistration model instance
    var vehicleregistrationObj = new Vehicleregistration(vehicleregistration);

    // Save the vehicleregistration
    vehicleregistrationObj.save(function () {
      // Request Vehicleregistrations
      request(app).get('/api/vehicleregistrations')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Vehicleregistration if not signed in', function (done) {
    // Create new Vehicleregistration model instance
    var vehicleregistrationObj = new Vehicleregistration(vehicleregistration);

    // Save the Vehicleregistration
    vehicleregistrationObj.save(function () {
      request(app).get('/api/vehicleregistrations/' + vehicleregistrationObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', vehicleregistration.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Vehicleregistration with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/vehicleregistrations/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Vehicleregistration is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Vehicleregistration which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Vehicleregistration
    request(app).get('/api/vehicleregistrations/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Vehicleregistration with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Vehicleregistration if signed in', function (done) {
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

        // Save a new Vehicleregistration
        agent.post('/api/vehicleregistrations')
          .send(vehicleregistration)
          .expect(200)
          .end(function (vehicleregistrationSaveErr, vehicleregistrationSaveRes) {
            // Handle Vehicleregistration save error
            if (vehicleregistrationSaveErr) {
              return done(vehicleregistrationSaveErr);
            }

            // Delete an existing Vehicleregistration
            agent.delete('/api/vehicleregistrations/' + vehicleregistrationSaveRes.body._id)
              .send(vehicleregistration)
              .expect(200)
              .end(function (vehicleregistrationDeleteErr, vehicleregistrationDeleteRes) {
                // Handle vehicleregistration error error
                if (vehicleregistrationDeleteErr) {
                  return done(vehicleregistrationDeleteErr);
                }

                // Set assertions
                (vehicleregistrationDeleteRes.body._id).should.equal(vehicleregistrationSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Vehicleregistration if not signed in', function (done) {
    // Set Vehicleregistration user
    vehicleregistration.user = user;

    // Create new Vehicleregistration model instance
    var vehicleregistrationObj = new Vehicleregistration(vehicleregistration);

    // Save the Vehicleregistration
    vehicleregistrationObj.save(function () {
      // Try deleting Vehicleregistration
      request(app).delete('/api/vehicleregistrations/' + vehicleregistrationObj._id)
        .expect(403)
        .end(function (vehicleregistrationDeleteErr, vehicleregistrationDeleteRes) {
          // Set message assertion
          (vehicleregistrationDeleteRes.body.message).should.match('User is not authorized');

          // Handle Vehicleregistration error error
          done(vehicleregistrationDeleteErr);
        });

    });
  });

  it('should be able to get a single Vehicleregistration that has an orphaned user reference', function (done) {
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

          // Save a new Vehicleregistration
          agent.post('/api/vehicleregistrations')
            .send(vehicleregistration)
            .expect(200)
            .end(function (vehicleregistrationSaveErr, vehicleregistrationSaveRes) {
              // Handle Vehicleregistration save error
              if (vehicleregistrationSaveErr) {
                return done(vehicleregistrationSaveErr);
              }

              // Set assertions on new Vehicleregistration
              (vehicleregistrationSaveRes.body.name).should.equal(vehicleregistration.name);
              should.exist(vehicleregistrationSaveRes.body.user);
              should.equal(vehicleregistrationSaveRes.body.user._id, orphanId);

              // force the Vehicleregistration to have an orphaned user reference
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

                    // Get the Vehicleregistration
                    agent.get('/api/vehicleregistrations/' + vehicleregistrationSaveRes.body._id)
                      .expect(200)
                      .end(function (vehicleregistrationInfoErr, vehicleregistrationInfoRes) {
                        // Handle Vehicleregistration error
                        if (vehicleregistrationInfoErr) {
                          return done(vehicleregistrationInfoErr);
                        }

                        // Set assertions
                        (vehicleregistrationInfoRes.body._id).should.equal(vehicleregistrationSaveRes.body._id);
                        (vehicleregistrationInfoRes.body.name).should.equal(vehicleregistration.name);
                        should.equal(vehicleregistrationInfoRes.body.user, undefined);

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
      Vehicleregistration.remove().exec(done);
    });
  });
});
