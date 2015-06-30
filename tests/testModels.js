var architect = require('architect'),
    path = require('path'),
    sutil = require('util'),
    async = require('async'),
    expect = require('chai').expect,
    app,
    dataConnection;
    
describe('models', function() {
    before(function(done) {
        var configPath = path.join(__dirname, "testconfig.js");
        var config = architect.loadConfig(configPath);
        architect.createApp(config, function (err, arch) {
            if (err) {
                done(err);
            } else {
                app = arch;
                dataConnection = app.getService("data");
                // console.log("Connecting to the data source");
                dataConnection.connect({}, function(err, connection) {
                    done();
                });
            }
        });
    });
    describe("#add", function() {
        it("should correctly add a data model", function(done) {
            var modelService = app.getService("models"),
                registry = modelService.registry;
            // var modelService = new ModelRegistry();
            var testSchema = new modelService.Schema({
                name: String,
                id: String
            });
            
            registry.add("test", testSchema, function(err, schema) {
                console.log(sutil.inspect(schema));
                done();
            });
        });
    });
    describe("#get", function() {
        it("should correctly add a data model", function(done) {
            var modelService = app.getService("models");
            var testSchema = new modelService.Schema({
                name: String,
                id: String
            });
            
            modelService.registry.add("test2", testSchema, function(err, dataModel) {
                if (!err) {
                    modelService.registry.getSchema("test2", function(err, Model) {
                        if (err) {
                            done(err);
                        } else {
                            var testModel = new Model();
                            testModel.name = "test";
                            testModel.id = "12345";
                            console.log(sutil.inspect(testModel));
                            done();
                        }
                    });
                } else {
                    console.error("Error encountered", err);
                    done(err);
                }
            });
        });
    });
    // describe("#load", function() {
    //     it("should correctly add a data model", function(done) {
    //         var modelService = app.getService("models");
    //         var testSchema = new modelService.Schema({
    //             name: String,
    //             id: String
    //         });
            
    //         modelService.addModel("test", testSchema, function(err, dataModel) {
    //             sutil.inspect(dataModel);
    //             done();
    //         });
    //     });
    // });    
});
