//Vehicles service used to communicate Vehicles REST endpoints
(function () {
  'use strict';

  angular
    .module('vehicles')
    .factory('VehiclesService', VehiclesService);

  VehiclesService.$inject = ['$resource'];

  function VehiclesService($resource) {
    return $resource('api/vehicles/:vehicleId', {
      vehicleId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
