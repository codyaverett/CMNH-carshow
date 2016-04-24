'use strict';

describe('Vehicleregistrations E2E Tests:', function () {
  describe('Test Vehicleregistrations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/vehicleregistrations');
      expect(element.all(by.repeater('vehicleregistration in vehicleregistrations')).count()).toEqual(0);
    });
  });
});
