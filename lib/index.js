/**
 * Reads and stores information about different database configurations based on the current
 * environment.  Gets the environment from the app.settings.env variable, which itself reads
 * the NODE_ENV environment variable and defaults to "development" if none is present.
 **/
var _ = require('underscore'),
    sutil = require('util'),
    async = require('async'),
    path = require('path'),
    mongoose = require('mongoose'),
    schemaRegistry =  require('mongoose-schema-registry'),
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
 * @param basedir the base directory to look for the models
 * @param dirname The directory name of to look for the models.
 * @param fn A callback that gets executed after the model is loaded.
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
 * Load the models from the configured location.
 * @param fn a Callback that gets executed after the models get loaded.
 **/
var load = function(fn) {
    loadFromFS(config.model_basedir, config.model_dirname, fn);
};

/**
 * Boot all of the schemas to mongoose models.
 **/
var bootModels = function() {
    var keys = schemaRegistry.getKeys();
    _.each(keys, function(key, index, list) {
        var thisSchema = schemaRegistry.getSchema(key);
        mongoose.model(key,  thisSchema);
    });
};

/**
 * Export the architecture module.
 **/
module.exports = function setup(options, imports, register) {
      var app = imports.app.app,
          async = require('async'),
          data = imports.data,
          mongoose = require('mongoose'), // The connection should be made by the plugin.
          acuteUtils = imports.utils,
          path = require('path');
        
  // console.log("Schema registry = ", sutil.inspect(schemaRegistry));
    register(null, {
      "models": {
        "mongoose": mongoose,
        "Schema": mongoose.Schema,
        "registry": schemaRegistry,
        "bootModels": bootModels,
        "registry": schemaRegistry
        // "add": schemaRegistry.add,
        // "remove": schemaRegistry.remove,
        // "getSchema": schemaRegistry.getSchema,
        // "log": schemaRegistry.log,
        // "getKeys": schemaRegistry.getKeys
      }
    });
};