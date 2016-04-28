(function () {
  'use strict';

  angular
    .module('vehicles')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Vehicles',
      state: 'vehicles',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'vehicles', {
      title: 'List Vehicles',
      state: 'vehicles.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'vehicles', {
      title: 'Create Vehicle',
      state: 'vehicles.create',
      roles: ['user']
    });
  }
})();
