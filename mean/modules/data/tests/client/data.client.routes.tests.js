(function () {
  'use strict';

  describe('Data Route Tests', function () {
    // Initialize global variables
    var $scope,
      DataService;

    //We can start by loading the main application module
    beforeEach(module(ApplicationConfiguration.applicationModuleName));

    // The injector ignores leading and trailing underscores here (i.e. _$httpBackend_).
    // This allows us to inject a service but then attach it to a variable
    // with the same name as the service.
    beforeEach(inject(function ($rootScope, _DataService_) {
      // Set a new global scope
      $scope = $rootScope.$new();
      DataService = _DataService_;
    }));

    describe('Route Config', function () {
      describe('Main Route', function () {
        var mainstate;
        beforeEach(inject(function ($state) {
          mainstate = $state.get('data');
        }));

        it('Should have the correct URL', function () {
          expect(mainstate.url).toEqual('/data');
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
          DataController,
          mockDatum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          viewstate = $state.get('data.view');
          $templateCache.put('modules/data/client/views/view-datum.client.view.html', '');

          // create mock Datum
          mockDatum = new DataService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Datum Name'
          });

          //Initialize Controller
          DataController = $controller('DataController as vm', {
            $scope: $scope,
            datumResolve: mockDatum
          });
        }));

        it('Should have the correct URL', function () {
          expect(viewstate.url).toEqual('/:datumId');
        });

        it('Should have a resolve function', function () {
          expect(typeof viewstate.resolve).toEqual('object');
          expect(typeof viewstate.resolve.datumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(viewstate, {
            datumId: 1
          })).toEqual('/data/1');
        }));

        it('should attach an Datum to the controller scope', function () {
          expect($scope.vm.datum._id).toBe(mockDatum._id);
        });

        it('Should not be abstract', function () {
          expect(viewstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(viewstate.templateUrl).toBe('modules/data/client/views/view-datum.client.view.html');
        });
      });

      describe('Create Route', function () {
        var createstate,
          DataController,
          mockDatum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          createstate = $state.get('data.create');
          $templateCache.put('modules/data/client/views/form-datum.client.view.html', '');

          // create mock Datum
          mockDatum = new DataService();

          //Initialize Controller
          DataController = $controller('DataController as vm', {
            $scope: $scope,
            datumResolve: mockDatum
          });
        }));

        it('Should have the correct URL', function () {
          expect(createstate.url).toEqual('/create');
        });

        it('Should have a resolve function', function () {
          expect(typeof createstate.resolve).toEqual('object');
          expect(typeof createstate.resolve.datumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(createstate)).toEqual('/data/create');
        }));

        it('should attach an Datum to the controller scope', function () {
          expect($scope.vm.datum._id).toBe(mockDatum._id);
          expect($scope.vm.datum._id).toBe(undefined);
        });

        it('Should not be abstract', function () {
          expect(createstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(createstate.templateUrl).toBe('modules/data/client/views/form-datum.client.view.html');
        });
      });

      describe('Edit Route', function () {
        var editstate,
          DataController,
          mockDatum;

        beforeEach(inject(function ($controller, $state, $templateCache) {
          editstate = $state.get('data.edit');
          $templateCache.put('modules/data/client/views/form-datum.client.view.html', '');

          // create mock Datum
          mockDatum = new DataService({
            _id: '525a8422f6d0f87f0e407a33',
            name: 'Datum Name'
          });

          //Initialize Controller
          DataController = $controller('DataController as vm', {
            $scope: $scope,
            datumResolve: mockDatum
          });
        }));

        it('Should have the correct URL', function () {
          expect(editstate.url).toEqual('/:datumId/edit');
        });

        it('Should have a resolve function', function () {
          expect(typeof editstate.resolve).toEqual('object');
          expect(typeof editstate.resolve.datumResolve).toEqual('function');
        });

        it('should respond to URL', inject(function ($state) {
          expect($state.href(editstate, {
            datumId: 1
          })).toEqual('/data/1/edit');
        }));

        it('should attach an Datum to the controller scope', function () {
          expect($scope.vm.datum._id).toBe(mockDatum._id);
        });

        it('Should not be abstract', function () {
          expect(editstate.abstract).toBe(undefined);
        });

        it('Should have templateUrl', function () {
          expect(editstate.templateUrl).toBe('modules/data/client/views/form-datum.client.view.html');
        });

        xit('Should go to unauthorized route', function () {

        });
      });

    });
  });
})();
