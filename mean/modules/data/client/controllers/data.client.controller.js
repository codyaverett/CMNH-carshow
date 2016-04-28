(function () {
  'use strict';

  // Data controller
  angular
    .module('data')
    .controller('DataController', DataController);

  DataController.$inject = ['$scope', '$state', 'Authentication', 'datumResolve'];

  function DataController ($scope, $state, Authentication, datum) {
    var vm = this;

    vm.authentication = Authentication;
    vm.datum = datum;
    vm.error = null;
    vm.form = {};
    vm.remove = remove;
    vm.save = save;

    // Remove existing Datum
    function remove() {
      if (confirm('Are you sure you want to delete?')) {
        vm.datum.$remove($state.go('data.list'));
      }
    }

    // Save Datum
    function save(isValid) {
      if (!isValid) {
        $scope.$broadcast('show-errors-check-validity', 'vm.form.datumForm');
        return false;
      }

      // TODO: move create/update logic to service
      if (vm.datum._id) {
        vm.datum.$update(successCallback, errorCallback);
      } else {
        vm.datum.$save(successCallback, errorCallback);
      }

      function successCallback(res) {
        $state.go('data.view', {
          datumId: res._id
        });
      }

      function errorCallback(res) {
        vm.error = res.data.message;
      }
    }
  }
})();
