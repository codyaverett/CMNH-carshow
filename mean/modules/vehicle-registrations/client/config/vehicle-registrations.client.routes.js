(function () {
  'use strict';

  angular
    .module('vehicle-registrations')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('vehicle-registrations', {
        abstract: true,
        url: '/vehicle-registrations',
        template: '<ui-view/>'
      })
      .state('vehicle-registrations.list', {
        url: '',
        templateUrl: 'modules/vehicle-registrations/client/views/list-vehicle-registrations.client.view.html',
        controller: 'VehicleRegistrationsListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Vehicle registrations List'
        }
      })
      .state('vehicle-registrations.create', {
        url: '/create',
        templateUrl: 'modules/vehicle-registrations/client/views/form-vehicle-registration.client.view.html',
        controller: 'VehicleRegistrationsController',
        controllerAs: 'vm',
        resolve: {
          vehicle-registrationResolve: newVehicleRegistration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Vehicle registrations Create'
        }
      })
      .state('vehicle-registrations.edit', {
        url: '/:vehicleRegistrationId/edit',
        templateUrl: 'modules/vehicle-registrations/client/views/form-vehicle-registration.client.view.html',
        controller: 'VehicleRegistrationsController',
        controllerAs: 'vm',
        resolve: {
          vehicle-registrationResolve: getVehicleRegistration
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Vehicle registration {{ vehicle-registrationResolve.name }}'
        }
      })
      .state('vehicle-registrations.view', {
        url: '/:vehicleRegistrationId',
        templateUrl: 'modules/vehicle-registrations/client/views/view-vehicle-registration.client.view.html',
        controller: 'VehicleRegistrationsController',
        controllerAs: 'vm',
        resolve: {
          vehicle-registrationResolve: getVehicleRegistration
        },
        data:{
          pageTitle: 'Vehicle registration {{ articleResolve.name }}'
        }
      });
  }

  getVehicleRegistration.$inject = ['$stateParams', 'VehicleRegistrationsService'];

  function getVehicleRegistration($stateParams, VehicleRegistrationsService) {
    return VehicleRegistrationsService.get({
      vehicleRegistrationId: $stateParams.vehicleRegistrationId
    }).$promise;
  }

  newVehicleRegistration.$inject = ['VehicleRegistrationsService'];

  function newVehicleRegistration(VehicleRegistrationsService) {
    return new VehicleRegistrationsService();
  }
})();
