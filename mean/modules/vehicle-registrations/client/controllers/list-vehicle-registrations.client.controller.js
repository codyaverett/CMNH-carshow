(function () {
  'use strict';

  angular
    .module('vehicle-registrations')
    .controller('VehicleRegistrationsListController', VehicleRegistrationsListController);

  VehicleRegistrationsListController.$inject = ['VehicleRegistrationsService'];

  function VehicleRegistrationsListController(VehicleRegistrationsService) {
    var vm = this;

    vm.vehicleRegistrations = VehicleRegistrationsService.query();
  }
})();
