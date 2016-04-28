(function () {
  'use strict';

  angular
    .module('vehicles')
    .controller('VehiclesListController', VehiclesListController);

  VehiclesListController.$inject = ['VehiclesService'];

  function VehiclesListController(VehiclesService) {
    var vm = this;

    vm.vehicles = VehiclesService.query();
  }
})();
