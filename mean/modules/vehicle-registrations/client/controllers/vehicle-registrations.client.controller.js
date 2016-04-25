(function () {
  'use strict';

  // Vehicle registrations controller
  angular
    .module('vehicle-registrations')
    .controller('VehicleRegistrationsController', VehicleRegistrationsController);

  VehicleRegistrationsController.$inject = ['$scope', '$state', 'Authentication', 'vehicleRegistrationResolve'];

  function VehicleRegistrationsController ($scope, $state, Authentication, vehicleRegistration) {
    var vm = this;

    vm.authentication = Authentication;
    vm.vehicleRegistration = vehicleRegistration;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Vehicle registration
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.vehicleRegistration.$remove($state.go('vehicle-registrations.list'));
      }
    }

    // Save Vehicle registration
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.vehicleRegistrationForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.vehicleRegistration._id) {
        vm.vehicleRegistration.$update(successCallback, errorCallback);
      } else {
        vm.vehicleRegistration.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('vehicle-registrations.view', {
          vehicleRegistrationId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
