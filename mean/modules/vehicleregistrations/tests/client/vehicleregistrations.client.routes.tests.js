(function () {
  'use strict';

  describe('Vehicleregistrations Route Tests', function () {
    // Initialize global variables
    var $scope,
      VehicleregistrationsService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _VehicleregistrationsService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      VehicleregistrationsService = _VehicleregistrationsService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('vehicleregistrations');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/vehicleregistrations');
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
          VehicleregistrationsController,
          mockVehicleregistration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('vehicleregistrations.view');
          $templateCache.put('modules/vehicleregistrations/client/views/view-vehicleregistration.client.view.html', '');

          // create mock Vehicleregistration
          mockVehicleregistration = new VehicleregistrationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vehicleregistration Name'
          });

          //Initialize Controller
          VehicleregistrationsController = $controller('VehicleregistrationsController as vm', {
            $scope: $scope,
            vehicleregistrationResolve: mockVehicleregistration
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:vehicleregistrationId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.vehicleregistrationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            vehicleregistrationId: 1
          })).toEqual('/vehicleregistrations/1');
        }));

        it('should attach an Vehicleregistration to the controller scope', function () {
          expect($scope.vm.vehicleregistration._id).toBe(mockVehicleregistration._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/vehicleregistrations/client/views/view-vehicleregistration.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          VehicleregistrationsController,
          mockVehicleregistration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('vehicleregistrations.create');
          $templateCache.put('modules/vehicleregistrations/client/views/form-vehicleregistration.client.view.html', '');

          // create mock Vehicleregistration
          mockVehicleregistration = new VehicleregistrationsService();

          //Initialize Controller
          VehicleregistrationsController = $controller('VehicleregistrationsController as vm', {
            $scope: $scope,
            vehicleregistrationResolve: mockVehicleregistration
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.vehicleregistrationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/vehicleregistrations/create');
        }));

        it('should attach an Vehicleregistration to the controller scope', function () {
          expect($scope.vm.vehicleregistration._id).toBe(mockVehicleregistration._id);
          expect($scope.vm.vehicleregistration._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/vehicleregistrations/client/views/form-vehicleregistration.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          VehicleregistrationsController,
          mockVehicleregistration;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('vehicleregistrations.edit');
          $templateCache.put('modules/vehicleregistrations/client/views/form-vehicleregistration.client.view.html', '');

          // create mock Vehicleregistration
          mockVehicleregistration = new VehicleregistrationsService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vehicleregistration Name'
          });

          //Initialize Controller
          VehicleregistrationsController = $controller('VehicleregistrationsController as vm', {
            $scope: $scope,
            vehicleregistrationResolve: mockVehicleregistration
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:vehicleregistrationId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.vehicleregistrationResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            vehicleregistrationId: 1
          })).toEqual('/vehicleregistrations/1/edit');
        }));

        it('should attach an Vehicleregistration to the controller scope', function () {
          expect($scope.vm.vehicleregistration._id).toBe(mockVehicleregistration._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/vehicleregistrations/client/views/form-vehicleregistration.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
