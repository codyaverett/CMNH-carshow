'use strict';

describe('Data E2E Tests:', function () {
  describe('Test Data page', function () {
    it('Should report missing credentials', function () {
      browser.get('http://localhost:3001/data');
      expect(element.all(by.repeater('datum in data')).count()).toEqual(0);
    });
  });
});
