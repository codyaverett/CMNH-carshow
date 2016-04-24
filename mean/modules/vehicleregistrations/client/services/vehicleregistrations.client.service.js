//Vehicleregistrations service used to communicate Vehicleregistrations REST endpoints
(function () {
  'use strict';

  angular
    .module('vehicleregistrations')
    .factory('VehicleregistrationsService', VehicleregistrationsService);

  VehicleregistrationsService.$inject = ['$resource'];

  function VehicleregistrationsService($resource) {
    return $resource('api/vehicleregistrations/:vehicleregistrationId', {
      vehicleregistrationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
