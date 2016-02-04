'use strict';

(function() {
	// Vehicle registrations Controller Spec
	describe('Vehicle registrations Controller Tests', function() {
		// Initialize global variables
		var VehicleRegistrationsController,
		scope,
		$httpBackend,
		$stateParams,
		$location;

		// The $resource service augments the response object with methods for updating and deleting the resource.
		// If we were to use the standard toEqual matcher, our tests would fail because the test values would not match
		// the responses exactly. To solve the problem, we define a new toEqualData Jasmine matcher.
		// When the toEqualData matcher compares two objects, it takes only object properties into
		// account and ignores methods.
		beforeEach(function() {
			jasmine.addMatchers({
				toEqualData: function(util, customEqualityTesters) {
					return {
						compare: function(actual, expected) {
							return {
								pass: angular.equals(actual, expected)
							};
						}
					};
				}
			});
		});

		// Then we can start by loading the main application module
		beforeEach(module(ApplicationConfiguration.applicationModuleName));

		// The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
		// This allows us to inject a service but then attach it to a variable
		// with the same name as the service.
		beforeEach(inject(function($controller, $rootScope, _$location_, _$stateParams_, _$httpBackend_) {
			// Set a new global scope
			scope = $rootScope.$new();

			// Point global variables to injected services
			$stateParams = _$stateParams_;
			$httpBackend = _$httpBackend_;
			$location = _$location_;

			// Initialize the Vehicle registrations controller.
			VehicleRegistrationsController = $controller('VehicleRegistrationsController', {
				$scope: scope
			});
		}));

		it('$scope.find() should create an array with at least one Vehicle registration object fetched from XHR', inject(function(VehicleRegistrations) {
			// Create sample Vehicle registration using the Vehicle registrations service
			var sampleVehicleRegistration = new VehicleRegistrations({
				name: 'New Vehicle registration'
			});

			// Create a sample Vehicle registrations array that includes the new Vehicle registration
			var sampleVehicleRegistrations = [sampleVehicleRegistration];

			// Set GET response
			$httpBackend.expectGET('vehicle-registrations').respond(sampleVehicleRegistrations);

			// Run controller functionality
			scope.find();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vehicleRegistrations).toEqualData(sampleVehicleRegistrations);
		}));

		it('$scope.findOne() should create an array with one Vehicle registration object fetched from XHR using a vehicleRegistrationId URL parameter', inject(function(VehicleRegistrations) {
			// Define a sample Vehicle registration object
			var sampleVehicleRegistration = new VehicleRegistrations({
				name: 'New Vehicle registration'
			});

			// Set the URL parameter
			$stateParams.vehicleRegistrationId = '525a8422f6d0f87f0e407a33';

			// Set GET response
			$httpBackend.expectGET(/vehicle-registrations\/([0-9a-fA-F]{24})$/).respond(sampleVehicleRegistration);

			// Run controller functionality
			scope.findOne();
			$httpBackend.flush();

			// Test scope value
			expect(scope.vehicleRegistration).toEqualData(sampleVehicleRegistration);
		}));

		it('$scope.create() with valid form data should send a POST request with the form input values and then locate to new object URL', inject(function(VehicleRegistrations) {
			// Create a sample Vehicle registration object
			var sampleVehicleRegistrationPostData = new VehicleRegistrations({
				name: 'New Vehicle registration'
			});

			// Create a sample Vehicle registration response
			var sampleVehicleRegistrationResponse = new VehicleRegistrations({
				_id: '525cf20451979dea2c000001',
				name: 'New Vehicle registration'
			});

			// Fixture mock form input values
			scope.name = 'New Vehicle registration';

			// Set POST response
			$httpBackend.expectPOST('vehicle-registrations', sampleVehicleRegistrationPostData).respond(sampleVehicleRegistrationResponse);

			// Run controller functionality
			scope.create();
			$httpBackend.flush();

			// Test form inputs are reset
			expect(scope.name).toEqual('');

			// Test URL redirection after the Vehicle registration was created
			expect($location.path()).toBe('/vehicle-registrations/' + sampleVehicleRegistrationResponse._id);
		}));

		it('$scope.update() should update a valid Vehicle registration', inject(function(VehicleRegistrations) {
			// Define a sample Vehicle registration put data
			var sampleVehicleRegistrationPutData = new VehicleRegistrations({
				_id: '525cf20451979dea2c000001',
				name: 'New Vehicle registration'
			});

			// Mock Vehicle registration in scope
			scope.vehicleRegistration = sampleVehicleRegistrationPutData;

			// Set PUT response
			$httpBackend.expectPUT(/vehicle-registrations\/([0-9a-fA-F]{24})$/).respond();

			// Run controller functionality
			scope.update();
			$httpBackend.flush();

			// Test URL location to new object
			expect($location.path()).toBe('/vehicle-registrations/' + sampleVehicleRegistrationPutData._id);
		}));

		it('$scope.remove() should send a DELETE request with a valid vehicleRegistrationId and remove the Vehicle registration from the scope', inject(function(VehicleRegistrations) {
			// Create new Vehicle registration object
			var sampleVehicleRegistration = new VehicleRegistrations({
				_id: '525a8422f6d0f87f0e407a33'
			});

			// Create new Vehicle registrations array and include the Vehicle registration
			scope.vehicleRegistrations = [sampleVehicleRegistration];

			// Set expected DELETE response
			$httpBackend.expectDELETE(/vehicle-registrations\/([0-9a-fA-F]{24})$/).respond(204);

			// Run controller functionality
			scope.remove(sampleVehicleRegistration);
			$httpBackend.flush();

			// Test array after successful delete
			expect(scope.vehicleRegistrations.length).toBe(0);
		}));
	});
}());