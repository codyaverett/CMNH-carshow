(function () {
  'use strict';

  angular
    .module('data')
    .run(menuConfig);

  menuConfig.$inject = ['Menus'];

  function menuConfig(Menus) {
    // Set top bar menu items
    Menus.addMenuItem('topbar', {
      title: 'Data',
      state: 'data',
      type: 'dropdown',
      roles: ['*']
    });

    // Add the dropdown list item
    Menus.addSubMenuItem('topbar', 'data', {
      title: 'List Data',
      state: 'data.list'
    });

    // Add the dropdown create item
    Menus.addSubMenuItem('topbar', 'data', {
      title: 'Create Datum',
      state: 'data.create',
      roles: ['user']
    });
  }
})();
