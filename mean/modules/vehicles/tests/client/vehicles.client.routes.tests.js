(function () {
  'use strict';

  describe('Vehicles Route Tests', function () {
    // Initialize global variables
    var $scope,
      VehiclesService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _VehiclesService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      VehiclesService = _VehiclesService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('vehicles');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/vehicles');
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
          VehiclesController,
          mockVehicle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('vehicles.view');
          $templateCache.put('modules/vehicles/client/views/view-vehicle.client.view.html', '');

          // create mock Vehicle
          mockVehicle = new VehiclesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vehicle Name'
          });

          //Initialize Controller
          VehiclesController = $controller('VehiclesController as vm', {
            $scope: $scope,
            vehicleResolve: mockVehicle
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:vehicleId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.vehicleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            vehicleId: 1
          })).toEqual('/vehicles/1');
        }));

        it('should attach an Vehicle to the controller scope', function () {
          expect($scope.vm.vehicle._id).toBe(mockVehicle._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/vehicles/client/views/view-vehicle.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          VehiclesController,
          mockVehicle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('vehicles.create');
          $templateCache.put('modules/vehicles/client/views/form-vehicle.client.view.html', '');

          // create mock Vehicle
          mockVehicle = new VehiclesService();

          //Initialize Controller
          VehiclesController = $controller('VehiclesController as vm', {
            $scope: $scope,
            vehicleResolve: mockVehicle
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.vehicleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/vehicles/create');
        }));

        it('should attach an Vehicle to the controller scope', function () {
          expect($scope.vm.vehicle._id).toBe(mockVehicle._id);
          expect($scope.vm.vehicle._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/vehicles/client/views/form-vehicle.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          VehiclesController,
          mockVehicle;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('vehicles.edit');
          $templateCache.put('modules/vehicles/client/views/form-vehicle.client.view.html', '');

          // create mock Vehicle
          mockVehicle = new VehiclesService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Vehicle Name'
          });

          //Initialize Controller
          VehiclesController = $controller('VehiclesController as vm', {
            $scope: $scope,
            vehicleResolve: mockVehicle
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:vehicleId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.vehicleResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            vehicleId: 1
          })).toEqual('/vehicles/1/edit');
        }));

        it('should attach an Vehicle to the controller scope', function () {
          expect($scope.vm.vehicle._id).toBe(mockVehicle._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/vehicles/client/views/form-vehicle.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
