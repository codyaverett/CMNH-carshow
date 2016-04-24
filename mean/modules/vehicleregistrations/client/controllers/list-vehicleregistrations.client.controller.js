(function () {
  'use strict';

  angular
    .module('vehicleregistrations')
    .controller('VehicleregistrationsListController', VehicleregistrationsListController);

  VehicleregistrationsListController.$inject = ['VehicleregistrationsService'];

  function VehicleregistrationsListController(VehicleregistrationsService) {
    var vm = this;

    vm.vehicleregistrations = VehicleregistrationsService.query();
  }
})();
