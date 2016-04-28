//Data service used to communicate Data REST endpoints
(function () {
  'use strict';

  angular
    .module('data')
    .factory('DataService', DataService);

  DataService.$inject = ['$resource'];

  function DataService($resource) {
    return $resource('api/data/:datumId', {
      datumId: '@_id'
    }, {
      update: {
        method: 'PUT'
      }
    });
  }
})();
