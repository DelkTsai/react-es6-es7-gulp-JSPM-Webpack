/* */ 
var defined = require('../../defined@1.0.0');
var opts = {
  y: false,
  w: 4
};
var x = defined(opts.x, opts.y, opts.w, 8);
console.log(x);
