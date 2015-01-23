/**
 * Reads and stores information about different database configurations based on the current
 * environment.  Gets the environment from the app.settings.env variable, which itself reads
 * the NODE_ENV environment variable and defaults to "development" if none is present.
 **/
var _ = require('underscore'),
    sutil = require('util'),
    async = require('async'),
    path = require('path'),
    config,  // Default configuration
    acuteUtils,
    app;
/**
 * @options is the hash of options the user passes in when creating an instance
 * of the plugin.
 * @imports is a hash of all services this plugin consumes.
 * @register is the callback to be called when the plugin is done initializing.
 */
module.exports = function setup(options, imports, register) {
      var app = imports.app.app,
          async = require('async'),
          data = imports.data,
          mongoose = require('mongoose'), // The connection should be made by the plugin.
          acuteUtils = imports.utils,
          path = require('path');
      
  /**
   * Add a data model to the application
   * @param name the name of the model
   * @param model The schema for the model
   * @param fn A callback that's fired after the model is registered.
   **/
  var add = function(name, schema, fn) {
    try {
      fn(null, mongoose.model(name, schema));
    } catch (e) {
      fn(e);
    }
  };
  
  var get = function(name, fn) {
    try {
      fn(null, mongoose.model(name));
    } catch (e) {
      fn(e);
    }
  };

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
          console.log("files in controller directory are ", files);
          async.each(files, function(file, cb) {
            var model = require(file);
            add(model.name, model.schema, function(err) {
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
        console.log("config = ", sutil.inspect(config));
        loadFromFS(config.model_basedir, config.model_dirname, fn);
    };

      register(null, {
        models: {
          mongoose: mongoose,
          Schema: mongoose.Schema,
          add: add,
          load: load,
          loadFromFS: loadFromFS,
          get: get
        }
      });
};