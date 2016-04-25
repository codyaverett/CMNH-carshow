(function () {
  'use strict';

  describe('Vehicle registrations Route Tests', function () {
    // Initialize global variables
    var $scope,
      VehicleRegistrationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _VehicleRegistrationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      VehicleRegistrationsService = _VehicleRegistrationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('vehicle-registrations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/vehicle-registrations');
        });

        it('Should be abstract', function () {
          expect(mainstate.abstract).toBe(true);
        });

        it('Should have template', function () {
          expect(mainstate.template).toBe('<ui-view/>');
        });
      });

      describe('View Route', function () {
        var viewstate,
          VehicleRegistrationsController,
          mockVehicleRegistration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('vehicle-registrations.view');
          $templateCache.put('modules/vehicle-registrations/client/views/view-vehicle-registration.client.view.html', '');

          // create mock Vehicle registration
          mockVehicleRegistration = new VehicleRegistrationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vehicle registration Name'
          });

          //Initialize Controller
          VehicleRegistrationsController = $controller('VehicleRegistrationsController as vm', {
            $scope: $scope,
            vehicleRegistrationResolve: mockVehicleRegistration
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:vehicleRegistrationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.vehicleRegistrationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            vehicleRegistrationId: 1
          })).toEqual('/vehicle-registrations/1');
        }));

        it('should attach an Vehicle registration to the controller scope', function () {
          expect($scope.vm.vehicleRegistration._id).toBe(mockVehicleRegistration._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/vehicle-registrations/client/views/view-vehicle-registration.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          VehicleRegistrationsController,
          mockVehicleRegistration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('vehicle-registrations.create');
          $templateCache.put('modules/vehicle-registrations/client/views/form-vehicle-registration.client.view.html', '');

          // create mock Vehicle registration
          mockVehicleRegistration = new VehicleRegistrationsService();

          //Initialize Controller
          VehicleRegistrationsController = $controller('VehicleRegistrationsController as vm', {
            $scope: $scope,
            vehicleRegistrationResolve: mockVehicleRegistration
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.vehicleRegistrationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/vehicle-registrations/create');
        }));

        it('should attach an Vehicle registration to the controller scope', function () {
          expect($scope.vm.vehicleRegistration._id).toBe(mockVehicleRegistration._id);
          expect($scope.vm.vehicleRegistration._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/vehicle-registrations/client/views/form-vehicle-registration.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          VehicleRegistrationsController,
          mockVehicleRegistration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('vehicle-registrations.edit');
          $templateCache.put('modules/vehicle-registrations/client/views/form-vehicle-registration.client.view.html', '');

          // create mock Vehicle registration
          mockVehicleRegistration = new VehicleRegistrationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vehicle registration Name'
          });

          //Initialize Controller
          VehicleRegistrationsController = $controller('VehicleRegistrationsController as vm', {
            $scope: $scope,
            vehicleRegistrationResolve: mockVehicleRegistration
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:vehicleRegistrationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.vehicleRegistrationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            vehicleRegistrationId: 1
          })).toEqual('/vehicle-registrations/1/edit');
        }));

        it('should attach an Vehicle registration to the controller scope', function () {
          expect($scope.vm.vehicleRegistration._id).toBe(mockVehicleRegistration._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/vehicle-registrations/client/views/form-vehicleRegistration.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
