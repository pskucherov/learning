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
    Authors = require(path.resolve(appDir + 'controllers/Authors'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        var authorModel = db.models['authors'];

        describe('Controller: Authors', function () {

            beforeEach(function (done) {
                this.timeout(10000);
                authorModel.find().remove(function() {
                    done();
                });
            });

            describe('CRUD authors', function () {

                it('should create author', function () {

                    var deferred = vow.defer(),
                        authorName = 'AName',
                        userId = 123;

                    Authors.create(authorModel, authorName, userId)
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
