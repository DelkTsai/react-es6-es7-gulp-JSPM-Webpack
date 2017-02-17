/* */ 
var concatMap = require('../../concat-map@0.0.1');
var xs = [1, 2, 3, 4, 5, 6];
var ys = concatMap(xs, function(x) {
  return x % 2 ? [x - 0.1, x, x + 0.1] : [];
});
console.dir(ys);
