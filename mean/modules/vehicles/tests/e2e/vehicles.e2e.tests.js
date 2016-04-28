'use strict';

describe('Vehicles E2E Tests:', function () {
  describe('Test Vehicles page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/vehicles');
      expect(element.all(by.repeater('vehicle in vehicles')).count()).toEqual(0);
    });
  });
});
