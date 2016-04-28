(function () {
  'use strict';

  angular
    .module('data')
    .config(routeConfig);

  routeConfig.$inject = ['$stateProvider'];

  function routeConfig($stateProvider) {
    $stateProvider
      .state('data', {
        abstract: true,
        url: '/data',
        template: '<ui-view/>'
      })
      .state('data.list', {
        url: '',
        templateUrl: 'modules/data/client/views/list-data.client.view.html',
        controller: 'DataListController',
        controllerAs: 'vm',
        data: {
          pageTitle: 'Data List'
        }
      })
      .state('data.create', {
        url: '/create',
        templateUrl: 'modules/data/client/views/form-datum.client.view.html',
        controller: 'DataController',
        controllerAs: 'vm',
        resolve: {
          datumResolve: newDatum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle : 'Data Create'
        }
      })
      .state('data.edit', {
        url: '/:datumId/edit',
        templateUrl: 'modules/data/client/views/form-datum.client.view.html',
        controller: 'DataController',
        controllerAs: 'vm',
        resolve: {
          datumResolve: getDatum
        },
        data: {
          roles: ['user', 'admin'],
          pageTitle: 'Edit Datum {{ datumResolve.name }}'
        }
      })
      .state('data.view', {
        url: '/:datumId',
        templateUrl: 'modules/data/client/views/view-datum.client.view.html',
        controller: 'DataController',
        controllerAs: 'vm',
        resolve: {
          datumResolve: getDatum
        },
        data:{
          pageTitle: 'Datum {{ articleResolve.name }}'
        }
      });
  }

  getDatum.$inject = ['$stateParams', 'DataService'];

  function getDatum($stateParams, DataService) {
    return DataService.get({
      datumId: $stateParams.datumId
    }).$promise;
  }

  newDatum.$inject = ['DataService'];

  function newDatum(DataService) {
    return new DataService();
  }
})();
