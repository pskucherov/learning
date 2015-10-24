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
    User = require(path.resolve(appDir + 'controllers/user'));


models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        describe('Controller: user', function () {

            beforeEach(function (done) {

                this.timeout(10000);

                User.deleteUserByVKId(db.models.users, 100).then(function () {
                    done();
                });

            });

            describe('Create and delete methods', function () {
                it('should create user in BD with vkid = 100', function () {
                    return assert.eventually.propertyVal(
                        User.createUserByVKId(db.models.users, 100),
                        'status', User.ANSWER.NEW_USER,
                        "Property 'status' should be equal User.ANSWER.NEW_USER"
                    );
                });

                it('should find user in BD with vkid = 100, when user exist', function () {
                    var deferred = vow.defer();
                    User.createUserByVKId(db.models.users, 100)
                        .then(function () {
                            deferred.resolve(User.createUserByVKId(db.models.users, 100));
                        });

                    return assert.eventually.propertyVal(
                        deferred.promise(),
                        'status', User.ANSWER.OLD_USER,
                        "Property 'status' should be equal User.ANSWER.NEW_USER"
                    );
                });

                it('should remove user from BD with vkid = 100', function () {
                    var deferred = vow.defer();
                    User.createUserByVKId(db.models.users, 100)
                        .then(function () {
                            deferred.resolve(User.deleteUserByVKId(db.models.users, 100));
                        });

                    return assert.eventually.equal(
                        deferred.promise(),
                        User.ANSWER.DELETED,
                        "Answer should be equal User.ANSWER.NEW_USER"
                    );
                });
            });

        });

        run();

    });

});
