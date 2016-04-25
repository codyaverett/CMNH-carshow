//Vehicle registrations service used to communicate Vehicle registrations REST endpoints
(function () {
  'use strict';

  angular
    .module('vehicle-registrations')
    .factory('VehicleRegistrationsService', VehicleRegistrationsService);

  VehicleRegistrationsService.$inject = ['$resource'];

  function VehicleRegistrationsService($resource) {
    return $resource('api/vehicle-registrations/:vehicleRegistrationId', {
      vehicleRegistrationId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
