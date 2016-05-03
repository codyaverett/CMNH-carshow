(function () {
  'use strict';

  angular
    .module('vehicles')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vehicles', {
        abstract: true,
        url: '/vehicles',
        template: '<ui-view/>'
      })
      .state('vehicles.list', {
        url: '',
        templateUrl: 'modules/vehicles/client/views/list-vehicles.client.view.html',
        controller: 'VehiclesListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Vehicles List'
        }
      })
      .state('vehicles.create', {
        url: '/create',
        templateUrl: 'modules/vehicles/client/views/form-vehicle.client.view.html',
        controller: 'VehiclesController',
        controllerAs: 'vm',
        resolve: {
          vehicleResolve: newVehicle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Vehicles Create'
        }
      })
      .state('vehicles.admin-create', {
        url: '/create/:user',
        templateUrl: 'modules/vehicles/client/views/form-vehicle.client.view.html',
        controller: 'VehiclesController',
        controllerAs: 'vm',
        resolve: {
          vehicleResolve: newVehicle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Vehicles Create'
        }
      })
      .state('vehicles.edit', {
        url: '/:vehicleId/edit',
        templateUrl: 'modules/vehicles/client/views/form-vehicle.client.view.html',
        controller: 'VehiclesController',
        controllerAs: 'vm',
        resolve: {
          vehicleResolve: getVehicle
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Vehicle {{ vehicleResolve.name }}'
        }
      })
      .state('vehicles.view', {
        url: '/:vehicleId',
        templateUrl: 'modules/vehicles/client/views/view-vehicle.client.view.html',
        controller: 'VehiclesController',
        controllerAs: 'vm',
        resolve: {
          vehicleResolve: getVehicle
        },
        data:{
          pageTitle: 'Vehicle {{ articleResolve.name }}'
        }
      });
  }

  getVehicle.$inject = ['$stateParams', 'VehiclesService'];

  function getVehicle($stateParams, VehiclesService) {
    return VehiclesService.get({
      vehicleId: $stateParams.vehicleId
    }).$promise;
  }

  newVehicle.$inject = ['VehiclesService'];

  function newVehicle(VehiclesService) {
    return new VehiclesService();
  }
})();
