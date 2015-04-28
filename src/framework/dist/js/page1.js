/**
 * Created by Ivan on 15-4-16.
 *
 * Version: 0.0.1
 *
 *//**
 * Created by Ivan on 2015/1/12.
 */
define(function(require, exports, module) {
  var app = require('./lib/mobile');
  return {
    init: function() {
      app.on('pageFirstInit', 'home', function() {
        alert(123);
      });
    }
  }
});