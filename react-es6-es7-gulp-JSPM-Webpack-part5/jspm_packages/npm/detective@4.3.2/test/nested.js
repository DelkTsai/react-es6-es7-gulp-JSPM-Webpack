/* */ 
var test = require('tap').test;
var detective = require('../../detective@4.3.2');
var fs = require('fs');
var src = fs.readFileSync(__dirname + '/files/nested.js');
test('nested', function(t) {
  t.deepEqual(detective(src), ['a', 'b', 'c']);
  t.end();
});
