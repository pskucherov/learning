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
    Poems = require(path.resolve(appDir + 'controllers/Poems'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        var pModel = db.models['poems'];

        describe('Controller: Poems', function () {

            beforeEach(function (done) {
                this.timeout(10000);
                pModel.find().remove(function() {
                    done();
                });
            });

            describe('CRUD Poems', function () {

                it('should create Poems', function () {

                    var deferred = vow.defer();

                    Poems.create(pModel, 'name', 1, 123)
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
