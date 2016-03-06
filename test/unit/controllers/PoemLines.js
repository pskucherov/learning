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
    PoemLines = require(path.resolve(appDir + 'controllers/PoemLines'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        var ptModel = db.models['poem-text'];

        describe('Controller: PoemLines', function () {

            beforeEach(function (done) {
                this.timeout(10000);
                ptModel.find().remove(function() {
                    done();
                });
            });

            describe('CRUD PoemLines', function () {

                it('should create PoemLines', function () {

                    var deferred = vow.defer();

                    PoemLines.create(ptModel, 1, 'текст стихотворения\n<Br>состоящий из нескольких строк ;":№%')
                        .then(function (data) {
                            deferred.resolve(data);
                        });

                    return assert.isFulfilled(
                        deferred.promise(),
                        'Should be resolved'
                    );

                });

                it('should create two lines in PoemLines', function () {

                    var deferred = vow.defer();

                    PoemLines.create(ptModel, 1, 'текст стихотворения\n<Br>состоящий из нескольких строк ;":№%')
                        .then(function (data) {
                            deferred.resolve(data);
                        });

                    return assert.eventually.lengthOf(
                        deferred.promise(),
                        2,
                        'Length should be equal 2'
                    );

                });

            });

        });

        run();

    });

});
