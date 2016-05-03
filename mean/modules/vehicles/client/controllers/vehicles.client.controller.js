(function () {
  'use strict';

  // Vehicles controller
  angular
    .module('vehicles')
    .controller('VehiclesController', VehiclesController);

  VehiclesController.$inject = ['$scope', '$state', '$stateParams', 'Authentication', 'vehicleResolve'];

  function VehiclesController ($scope, $state, $stateParams, Authentication, vehicle) {
    var vm = this;

    vm.authentication = Authentication;
    vm.vehicle = vehicle;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    vm.user = { _id: $stateParams.user }; //getting ID parameters from parameters 
    //console.log(vm.user);

    // Remove existing Vehicle
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.vehicle.$remove($state.go('vehicles.list'));
      }
    }

    // Save Vehicle
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vehicleForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.vehicle._id) {
        vm.vehicle.$update(successCallback, errorCallback);
      } else {
        vm.vehicle.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('vehicles.view', {
          vehicleId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
