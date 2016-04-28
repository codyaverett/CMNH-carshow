(function () {
  'use strict';

  angular
    .module('data')
    .controller('DataListController', DataListController);

  DataListController.$inject = ['DataService'];

  function DataListController(DataService) {
    var vm = this;

    vm.data = DataService.query();
  }
})();
