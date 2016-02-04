'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	VehicleRegistration = mongoose.model('VehicleRegistration'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, vehicleRegistration;

/**
 * Vehicle registration routes tests
 */
describe('Vehicle registration CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
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
		user.save(function() {
			vehicleRegistration = {
				name: 'Vehicle registration Name'
			};

			done();
		});
	});

	it('should be able to save Vehicle registration instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle registration
				agent.post('/vehicle-registrations')
					.send(vehicleRegistration)
					.expect(200)
					.end(function(vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
						// Handle Vehicle registration save error
						if (vehicleRegistrationSaveErr) done(vehicleRegistrationSaveErr);

						// Get a list of Vehicle registrations
						agent.get('/vehicle-registrations')
							.end(function(vehicleRegistrationsGetErr, vehicleRegistrationsGetRes) {
								// Handle Vehicle registration save error
								if (vehicleRegistrationsGetErr) done(vehicleRegistrationsGetErr);

								// Get Vehicle registrations list
								var vehicleRegistrations = vehicleRegistrationsGetRes.body;

								// Set assertions
								(vehicleRegistrations[0].user._id).should.equal(userId);
								(vehicleRegistrations[0].name).should.match('Vehicle registration Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Vehicle registration instance if not logged in', function(done) {
		agent.post('/vehicle-registrations')
			.send(vehicleRegistration)
			.expect(401)
			.end(function(vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
				// Call the assertion callback
				done(vehicleRegistrationSaveErr);
			});
	});

	it('should not be able to save Vehicle registration instance if no name is provided', function(done) {
		// Invalidate name field
		vehicleRegistration.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle registration
				agent.post('/vehicle-registrations')
					.send(vehicleRegistration)
					.expect(400)
					.end(function(vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
						// Set message assertion
						(vehicleRegistrationSaveRes.body.message).should.match('Please fill Vehicle registration name');
						
						// Handle Vehicle registration save error
						done(vehicleRegistrationSaveErr);
					});
			});
	});

	it('should be able to update Vehicle registration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle registration
				agent.post('/vehicle-registrations')
					.send(vehicleRegistration)
					.expect(200)
					.end(function(vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
						// Handle Vehicle registration save error
						if (vehicleRegistrationSaveErr) done(vehicleRegistrationSaveErr);

						// Update Vehicle registration name
						vehicleRegistration.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Vehicle registration
						agent.put('/vehicle-registrations/' + vehicleRegistrationSaveRes.body._id)
							.send(vehicleRegistration)
							.expect(200)
							.end(function(vehicleRegistrationUpdateErr, vehicleRegistrationUpdateRes) {
								// Handle Vehicle registration update error
								if (vehicleRegistrationUpdateErr) done(vehicleRegistrationUpdateErr);

								// Set assertions
								(vehicleRegistrationUpdateRes.body._id).should.equal(vehicleRegistrationSaveRes.body._id);
								(vehicleRegistrationUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Vehicle registrations if not signed in', function(done) {
		// Create new Vehicle registration model instance
		var vehicleRegistrationObj = new VehicleRegistration(vehicleRegistration);

		// Save the Vehicle registration
		vehicleRegistrationObj.save(function() {
			// Request Vehicle registrations
			request(app).get('/vehicle-registrations')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Vehicle registration if not signed in', function(done) {
		// Create new Vehicle registration model instance
		var vehicleRegistrationObj = new VehicleRegistration(vehicleRegistration);

		// Save the Vehicle registration
		vehicleRegistrationObj.save(function() {
			request(app).get('/vehicle-registrations/' + vehicleRegistrationObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', vehicleRegistration.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Vehicle registration instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Vehicle registration
				agent.post('/vehicle-registrations')
					.send(vehicleRegistration)
					.expect(200)
					.end(function(vehicleRegistrationSaveErr, vehicleRegistrationSaveRes) {
						// Handle Vehicle registration save error
						if (vehicleRegistrationSaveErr) done(vehicleRegistrationSaveErr);

						// Delete existing Vehicle registration
						agent.delete('/vehicle-registrations/' + vehicleRegistrationSaveRes.body._id)
							.send(vehicleRegistration)
							.expect(200)
							.end(function(vehicleRegistrationDeleteErr, vehicleRegistrationDeleteRes) {
								// Handle Vehicle registration error error
								if (vehicleRegistrationDeleteErr) done(vehicleRegistrationDeleteErr);

								// Set assertions
								(vehicleRegistrationDeleteRes.body._id).should.equal(vehicleRegistrationSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Vehicle registration instance if not signed in', function(done) {
		// Set Vehicle registration user 
		vehicleRegistration.user = user;

		// Create new Vehicle registration model instance
		var vehicleRegistrationObj = new VehicleRegistration(vehicleRegistration);

		// Save the Vehicle registration
		vehicleRegistrationObj.save(function() {
			// Try deleting Vehicle registration
			request(app).delete('/vehicle-registrations/' + vehicleRegistrationObj._id)
			.expect(401)
			.end(function(vehicleRegistrationDeleteErr, vehicleRegistrationDeleteRes) {
				// Set message assertion
				(vehicleRegistrationDeleteRes.body.message).should.match('User is not logged in');

				// Handle Vehicle registration error error
				done(vehicleRegistrationDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		VehicleRegistration.remove().exec();
		done();
	});
});