(function () {
  'use strict';

  angular
    .module('vehicleregistrations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Vehicleregistrations',
      state: 'vehicleregistrations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'vehicleregistrations', {
      title: 'List Vehicleregistrations',
      state: 'vehicleregistrations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'vehicleregistrations', {
      title: 'Create Vehicleregistration',
      state: 'vehicleregistrations.create',
      roles: ['user']
    });
  }
})();
