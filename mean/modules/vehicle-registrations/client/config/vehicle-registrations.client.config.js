(function () {
  'use strict';

  angular
    .module('vehicle-registrations')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Vehicle registrations',
      state: 'vehicle-registrations',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'vehicle-registrations', {
      title: 'List Vehicle registrations',
      state: 'vehicle-registrations.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'vehicle-registrations', {
      title: 'Create Vehicle registration',
      state: 'vehicle-registrations.create',
      roles: ['user']
    });
  }
})();
