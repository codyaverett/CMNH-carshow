(function () {
  'use strict';

  angular
    .module('vehicleregistrations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vehicleregistrations', {
        abstract: true,
        url: '/vehicleregistrations',
        template: '<ui-view/>'
      })
      .state('vehicleregistrations.list', {
        url: '',
        templateUrl: 'modules/vehicleregistrations/client/views/list-vehicleregistrations.client.view.html',
        controller: 'VehicleregistrationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Vehicleregistrations List'
        }
      })
      .state('vehicleregistrations.create', {
        url: '/create',
        templateUrl: 'modules/vehicleregistrations/client/views/form-vehicleregistration.client.view.html',
        controller: 'VehicleregistrationsController',
        controllerAs: 'vm',
        resolve: {
          vehicleregistrationResolve: newVehicleregistration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Vehicleregistrations Create'
        }
      })
      .state('vehicleregistrations.edit', {
        url: '/:vehicleregistrationId/edit',
        templateUrl: 'modules/vehicleregistrations/client/views/form-vehicleregistration.client.view.html',
        controller: 'VehicleregistrationsController',
        controllerAs: 'vm',
        resolve: {
          vehicleregistrationResolve: getVehicleregistration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Vehicleregistration {{ vehicleregistrationResolve.name }}'
        }
      })
      .state('vehicleregistrations.view', {
        url: '/:vehicleregistrationId',
        templateUrl: 'modules/vehicleregistrations/client/views/view-vehicleregistration.client.view.html',
        controller: 'VehicleregistrationsController',
        controllerAs: 'vm',
        resolve: {
          vehicleregistrationResolve: getVehicleregistration
        },
        data:{
          pageTitle: 'Vehicleregistration {{ articleResolve.name }}'
        }
      });
  }

  getVehicleregistration.$inject = ['$stateParams', 'VehicleregistrationsService'];

  function getVehicleregistration($stateParams, VehicleregistrationsService) {
    return VehicleregistrationsService.get({
      vehicleregistrationId: $stateParams.vehicleregistrationId
    }).$promise;
  }

  newVehicleregistration.$inject = ['VehicleregistrationsService'];

  function newVehicleregistration(VehicleregistrationsService) {
    return new VehicleregistrationsService();
  }
})();
