/**
 * Created by Ivan on 2015/1/12.
 */
define(function() {
  var app = require('./lib/app');
  return {
    init: function() {
      app.on('pageFirstInit', 'home', function() {
        alert(123);
      });
    }
  }
});