(function () {
  'use strict';

  // Vehicleregistrations controller
  angular
    .module('vehicleregistrations')
    .controller('VehicleregistrationsController', VehicleregistrationsController);

  VehicleregistrationsController.$inject = ['$scope', '$state', 'Authentication', 'vehicleregistrationResolve'];

  function VehicleregistrationsController ($scope, $state, Authentication, vehicleregistration) {
    var vm = this;

    vm.authentication = Authentication;
    vm.vehicleregistration = vehicleregistration;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Vehicleregistration
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.vehicleregistration.$remove($state.go('vehicleregistrations.list'));
      }
    }

    // Save Vehicleregistration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vehicleregistrationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.vehicleregistration._id) {
        vm.vehicleregistration.$update(successCallback, errorCallback);
      } else {
        vm.vehicleregistration.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('vehicleregistrations.view', {
          vehicleregistrationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
