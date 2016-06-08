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
    Complaints = require(path.resolve(appDir + 'controllers/Complaints'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        var complaintsModel = db.models['complaints'];

        describe('Controller: Complaints', function () {

            beforeEach(function (done) {
                this.timeout(10000);
                complaintsModel.find().remove(function() {
                    done();
                });
            });

            describe('CRUD complaints', function () {

                it('should create complaints', function () {

                    var deferred = vow.defer();

                    Complaints.createComplaint(complaintsModel, 'tname', 1, '1,2,3,4,5', 'comment', 'a12345678901')
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
