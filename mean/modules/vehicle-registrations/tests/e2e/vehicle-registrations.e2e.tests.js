'use strict';

describe('Vehicle registrations E2E Tests:', function () {
  describe('Test Vehicle registrations page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/vehicle-registrations');
      expect(element.all(by.repeater('vehicle-registration in vehicle-registrations')).count()).toEqual(0);
    });
  });
});
