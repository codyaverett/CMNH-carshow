'use strict';

var should = require('should'),
  request = require('supertest'),
  path = require('path'),
  mongoose = require('mongoose'),
  User = mongoose.model('User'),
  Datum = mongoose.model('Datum'),
  express = require(path.resolve('./config/lib/express'));

/**
 * Globals
 */
var app, agent, credentials, user, datum;

/**
 * Datum routes tests
 */
describe('Datum CRUD tests', function () {

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

    // Save a user to the test db and create new Datum
    user.save(function () {
      datum = {
        name: 'Datum name'
      };

      done();
    });
  });

  it('should be able to save a Datum if logged in', function (done) {
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

        // Save a new Datum
        agent.post('/api/data')
          .send(datum)
          .expect(200)
          .end(function (datumSaveErr, datumSaveRes) {
            // Handle Datum save error
            if (datumSaveErr) {
              return done(datumSaveErr);
            }

            // Get a list of Data
            agent.get('/api/data')
              .end(function (datumsGetErr, datumsGetRes) {
                // Handle Datum save error
                if (datumsGetErr) {
                  return done(datumsGetErr);
                }

                // Get Data list
                var data = dataGetRes.body;

                // Set assertions
                (data[0].user._id).should.equal(userId);
                (data[0].name).should.match('Datum name');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to save an Datum if not logged in', function (done) {
    agent.post('/api/data')
      .send(datum)
      .expect(403)
      .end(function (datumSaveErr, datumSaveRes) {
        // Call the assertion callback
        done(datumSaveErr);
      });
  });

  it('should not be able to save an Datum if no name is provided', function (done) {
    // Invalidate name field
    datum.name = '';

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

        // Save a new Datum
        agent.post('/api/data')
          .send(datum)
          .expect(400)
          .end(function (datumSaveErr, datumSaveRes) {
            // Set message assertion
            (datumSaveRes.body.message).should.match('Please fill Datum name');

            // Handle Datum save error
            done(datumSaveErr);
          });
      });
  });

  it('should be able to update an Datum if signed in', function (done) {
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

        // Save a new Datum
        agent.post('/api/data')
          .send(datum)
          .expect(200)
          .end(function (datumSaveErr, datumSaveRes) {
            // Handle Datum save error
            if (datumSaveErr) {
              return done(datumSaveErr);
            }

            // Update Datum name
            datum.name = 'WHY YOU GOTTA BE SO MEAN?';

            // Update an existing Datum
            agent.put('/api/data/' + datumSaveRes.body._id)
              .send(datum)
              .expect(200)
              .end(function (datumUpdateErr, datumUpdateRes) {
                // Handle Datum update error
                if (datumUpdateErr) {
                  return done(datumUpdateErr);
                }

                // Set assertions
                (datumUpdateRes.body._id).should.equal(datumSaveRes.body._id);
                (datumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should be able to get a list of Data if not signed in', function (done) {
    // Create new Datum model instance
    var datumObj = new Datum(datum);

    // Save the datum
    datumObj.save(function () {
      // Request Data
      request(app).get('/api/data')
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Array).and.have.lengthOf(1);

          // Call the assertion callback
          done();
        });

    });
  });

  it('should be able to get a single Datum if not signed in', function (done) {
    // Create new Datum model instance
    var datumObj = new Datum(datum);

    // Save the Datum
    datumObj.save(function () {
      request(app).get('/api/data/' + datumObj._id)
        .end(function (req, res) {
          // Set assertion
          res.body.should.be.instanceof(Object).and.have.property('name', datum.name);

          // Call the assertion callback
          done();
        });
    });
  });

  it('should return proper error for single Datum with an invalid Id, if not signed in', function (done) {
    // test is not a valid mongoose Id
    request(app).get('/api/data/test')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'Datum is invalid');

        // Call the assertion callback
        done();
      });
  });

  it('should return proper error for single Datum which doesnt exist, if not signed in', function (done) {
    // This is a valid mongoose Id but a non-existent Datum
    request(app).get('/api/data/559e9cd815f80b4c256a8f41')
      .end(function (req, res) {
        // Set assertion
        res.body.should.be.instanceof(Object).and.have.property('message', 'No Datum with that identifier has been found');

        // Call the assertion callback
        done();
      });
  });

  it('should be able to delete an Datum if signed in', function (done) {
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

        // Save a new Datum
        agent.post('/api/data')
          .send(datum)
          .expect(200)
          .end(function (datumSaveErr, datumSaveRes) {
            // Handle Datum save error
            if (datumSaveErr) {
              return done(datumSaveErr);
            }

            // Delete an existing Datum
            agent.delete('/api/data/' + datumSaveRes.body._id)
              .send(datum)
              .expect(200)
              .end(function (datumDeleteErr, datumDeleteRes) {
                // Handle datum error error
                if (datumDeleteErr) {
                  return done(datumDeleteErr);
                }

                // Set assertions
                (datumDeleteRes.body._id).should.equal(datumSaveRes.body._id);

                // Call the assertion callback
                done();
              });
          });
      });
  });

  it('should not be able to delete an Datum if not signed in', function (done) {
    // Set Datum user
    datum.user = user;

    // Create new Datum model instance
    var datumObj = new Datum(datum);

    // Save the Datum
    datumObj.save(function () {
      // Try deleting Datum
      request(app).delete('/api/data/' + datumObj._id)
        .expect(403)
        .end(function (datumDeleteErr, datumDeleteRes) {
          // Set message assertion
          (datumDeleteRes.body.message).should.match('User is not authorized');

          // Handle Datum error error
          done(datumDeleteErr);
        });

    });
  });

  it('should be able to get a single Datum that has an orphaned user reference', function (done) {
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

          // Save a new Datum
          agent.post('/api/data')
            .send(datum)
            .expect(200)
            .end(function (datumSaveErr, datumSaveRes) {
              // Handle Datum save error
              if (datumSaveErr) {
                return done(datumSaveErr);
              }

              // Set assertions on new Datum
              (datumSaveRes.body.name).should.equal(datum.name);
              should.exist(datumSaveRes.body.user);
              should.equal(datumSaveRes.body.user._id, orphanId);

              // force the Datum to have an orphaned user reference
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

                    // Get the Datum
                    agent.get('/api/data/' + datumSaveRes.body._id)
                      .expect(200)
                      .end(function (datumInfoErr, datumInfoRes) {
                        // Handle Datum error
                        if (datumInfoErr) {
                          return done(datumInfoErr);
                        }

                        // Set assertions
                        (datumInfoRes.body._id).should.equal(datumSaveRes.body._id);
                        (datumInfoRes.body.name).should.equal(datum.name);
                        should.equal(datumInfoRes.body.user, undefined);

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
      Datum.remove().exec(done);
    });
  });
});
