/**
 * Reads and stores information about different database configurations based on the current
 * environment.  Gets the environment from the app.settings.env variable, which itself reads
 * the NODE_ENV environment variable and defaults to "development" if none is present.
 **/
var _ = require('underscore'),
    sutil = require('util'),
    async = require('async'),
    path = require('path'),
    schemaRegistry= require('mongoose-schema-registry'),
    mongoose = require('mongoose'),
    config,  // Default configuration
    acuteUtils,
    app;
/**
 * @options is the hash of options the user passes in when creating an instance
 * of the plugin.
 * @imports is a hash of all services this plugin consumes.
 * @register is the callback to be called when the plugin is done initializing.
 */

/**
 * Walk through the models directory and add all of the models there
 * to the app.
 **/
var loadFromFS = function(basedir, dirname, fn) {
  acuteUtils.walkFs(path.join(basedir, dirname), function(err, files) {
      if (err) {
        fn(err);
          // completeFn();
      } else {
        console.log("files are ", files);
        async.each(files, function(file, cb) {
          var model = require(file);
          schemaRegistry.add(model.name, model.schema, function(err) {
            if(!err) {
              cb();
            } else {
              cb(err);
            }
          });
        }, function(err) {
          if (err) {
            fn(err);
          } else {
            fn();
          }
        });
      }
  });
};

/**
 * Load the controllers from the configured location.
 **/
var load = function(fn) {
    loadFromFS(config.model_basedir, config.model_dirname, fn);
};

var bootModels = function() {
    var keys = schemaRegistry.getKeys();
    _.each(keys, function(key, index, list) {
        var thisSchema = schemaRegistry.getSchema(key);
        mongoose.model(key,  thisSchema);
    });
};

module.exports = function setup(options, imports, register) {
      var app = imports.app.app,
          async = require('async'),
          data = imports.data,
          mongoose = require('mongoose'), // The connection should be made by the plugin.
          acuteUtils = imports.utils,
          path = require('path');
      
  
    register(null, {
      "models": {
        "mongoose": mongoose,
        "Schema": mongoose.Schema,
        "registry": schemaRegistry,
        "bootModels": bootModels,
        "add": schemaRegistry.add,
        "remove": schemaRegistry.remove,
        "getSchema": schemaRegistry.getSchema,
        "log": schemaRegistry.log,
        "getKeys": schemaRegistry.getKeys
      }
    })
    //   load(function(err) {
    //   if (err) {
    //     register(err);
    //   } else {
    //     register(null, {
    //       models: {
    //         mongoose: mongoose,
    //         Schema: mongoose.Schema,
    //         add: add,
    //         load: load,
    //         loadFromFS: loadFromFS,
    //         get: get
    //       }
    //     });
    //   }
    // });
};