/* */ 
var brorand = require('../../brorand@1.0.7');
var assert = require('assert');
describe('Brorand', function() {
  it('should generate random numbers', function() {
    assert.equal(brorand(100).length, 100);
  });
});
