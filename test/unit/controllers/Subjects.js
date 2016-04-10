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
    Subjects = require(path.resolve(appDir + 'controllers/Subjects'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        var sModel = db.models['subjects'];

        describe('Controller: Subjects', function () {

            beforeEach(function (done) {
                this.timeout(10000);
                sModel.find().remove(function() {
                    done();
                });
            });

            describe('CRUD Subjects', function () {

                it('should create and get subjects', function () {
                    var deferred = vow.defer();

                    sModel.create({ name: 'SubjName' }, function (err, subj) {
                        if (err) throw err;

                        Subjects.get(sModel, subj._id).then(function(result) {
                            deferred.resolve(result.name);
                        });
                    });

                    return assert.eventually.equal(
                        deferred.promise(),
                        'SubjName',
                        'Shouild be equal SubjName'
                    );
                });

                it('should get empty subject', function () {
                    var deferred = vow.defer();

                    Subjects.get(sModel, 123).then(function(subj) {
                        deferred.resolve(subj);
                    });

                    return assert.eventually.lengthOf(
                        deferred.promise(),
                        0,
                        'Shouild be empty array'
                    );
                });

            });

        });

        run();

    });

});
