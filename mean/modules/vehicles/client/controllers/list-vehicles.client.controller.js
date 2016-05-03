(function () {
  'use strict';

  angular
    .module('vehicles')
    .controller('VehiclesListController', VehiclesListController);

  VehiclesListController.$inject = ['VehiclesService', 'Authentication'];

  function VehiclesListController(VehiclesService, Authentication) {
    var vm = this;
    vm.authentication = Authentication;

    vm.vehicles = VehiclesService.query();
  }
})();
