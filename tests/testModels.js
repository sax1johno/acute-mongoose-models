var architect = require('architect'),
    path = require('path'),
    sutil = require('util'),
    async = require('async'),
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
                dataConnection.connect({}, function(err, connection) {
                    done();
                });
            }
        });
    });
    describe("#add", function() {
        it("should correctly add a data model", function(done) {
            var modelService = app.getService("models");
            var testSchema = new modelService.Schema({
                name: String,
                id: String
            });
            
            modelService.add("test", testSchema, function(err, dataModel) {
                sutil.inspect(dataModel);
                done();
            });
            // serviceObject.connect({}, function(err, connection) {
            //     if (!err) {
            //         console.log("data = ", sutil.inspect(app.app.get('data')));
            //         done();
            //     } else {
            //         console.log("Error encountered when attempting to connect: ", err);
            //         done(false);
            //     }
            // });
        });
    });
    describe("#get", function() {
        it("should correctly add a data model", function(done) {
            var modelService = app.getService("models");
            var testSchema = new modelService.Schema({
                name: String,
                id: String
            });
            
            modelService.add("test2", testSchema, function(err, dataModel) {
                if (!err) {
                    modelService.get("test2", function(err, Model) {
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
