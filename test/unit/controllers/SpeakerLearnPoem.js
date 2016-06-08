var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var assert = chai.assert,
    _ = require('lodash'),
    path = require('path'),
    express = require('express'),
    app = express(),
    vow = require('vow');

var appDir = './common.blocks/app/',
    models = require(path.resolve(appDir + 'models/')),
    SpeakerLearnPoem = require(path.resolve(appDir + 'controllers/SpeakerLearnPoem'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        var slpModel = db.models['speaker-learn-poem'];

        describe('Controller: SpeakerLearnPoem', function () {

            beforeEach(function (done) {
                this.timeout(10000);
                slpModel.find().remove(function() {
                    done();
                });
            });

            describe('CRUD SpeakerLearnPoem', function () {

                it('should create SpeakerLearnPoem', function () {

                    var deferred = vow.defer();

                    SpeakerLearnPoem.createProgress(slpModel, 1, 'a12345678901')
                        .then(function (data) {
                            deferred.resolve(data);
                        });

                    return assert.isFulfilled(
                        deferred.promise(),
                        'Should be resolved'
                    );

                });

            });

        });

        run();

    });

});
