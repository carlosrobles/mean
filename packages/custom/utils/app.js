'use strict';

/*
 * Defining the Package
 */
var Module = require('meanio').Module;

var Utils = new Module('utils');

/*
 * All MEAN packages require registration
 * Dependency injection is used to define required modules
 */
Utils.register(function(app, auth, database) {

  //We enable routing. By default the Package Object is passed to the routes
  Utils.routes(app, auth, database);


  return Utils;
});
