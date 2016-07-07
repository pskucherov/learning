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
                        userId = 'a12345678901';

                    Authors.create(authorModel, authorName, userId)
                        .then(function (data) {
                            deferred.resolve(data);
                        });

                    return assert.isFulfilled(
                        deferred.promise(),
                        'Should be resolved'
                    );

                });

                it('should find by regexp query', function () {

                    var deferred = vow.defer(),
                        authorName = 'AName',
                        userId = 'a12345678901';

                    Authors.create(authorModel, authorName, userId)
                        .then(function (data) {
                            Authors.findByQuery(authorModel, 'Na', userId)
                                .then(function(author) {
                                    deferred.resolve(author);
                                });
                        });

                    return assert.eventually.lengthOf(
                        deferred.promise(),
                        1,
                        'Length should be equal 1'
                    );

                });

                it('should find author, which added by user', function () {

                    var deferred = vow.defer(),
                        authorName = 'AName',
                        userId = 'a12345678901';

                    Authors.create(authorModel, authorName, userId)
                        .then(function (data) {
                            Authors.findByQuery(authorModel, '', userId)
                                .then(function(author) {
                                    deferred.resolve(author);
                                });
                        });

                    return assert.eventually.lengthOf(
                        deferred.promise(),
                        1,
                        'Length should be equal 1'
                    );

                });

                it('should find author by _id', function () {

                    var deferred = vow.defer(),
                        authorName = 'AName',
                        userId = 'a12345678901';

                    Authors.create(authorModel, authorName, userId)
                        .then(function (data) {
                            Authors.getById(authorModel, data._id)
                                .then(function(author) {
                                    deferred.resolve(!_.isEmpty(author));
                                });
                        });

                    return assert.eventually.ok(
                        deferred.promise(),
                        'Should be not empty'
                    );

                });


            });

        });

        run();

    });

});
