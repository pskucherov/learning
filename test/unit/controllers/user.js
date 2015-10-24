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

    var VK_USER_ID = 100,
        usersModel = db.models.users;

    db.sync(function (err) {
        if (err) throw err;

        describe('Controller: user', function () {

            beforeEach(function (done) {

                this.timeout(10000);

                User.deleteByVKId(usersModel, VK_USER_ID).then(function () {
                    done();
                });

            });

            describe('Create and delete methods', function () {
                it('should create user in BD', function () {
                    return assert.eventually.propertyVal(
                        User.createByVKId(usersModel, VK_USER_ID),
                        'status', User.ANSWER.NEW_USER,
                        "Property 'status' should be equal User.ANSWER.NEW_USER"
                    );
                });

                it('should find user in BD, when user exist', function () {
                    var deferred = vow.defer();
                    User.createByVKId(usersModel, VK_USER_ID)
                        .then(function () {
                            deferred.resolve(User.createByVKId(usersModel, VK_USER_ID));
                        });

                    return assert.eventually.propertyVal(
                        deferred.promise(),
                        'status', User.ANSWER.OLD_USER,
                        "Property 'status' should be equal User.ANSWER.NEW_USER"
                    );
                });

                it('should remove user from BD', function () {
                    var deferred = vow.defer();
                    User.createByVKId(usersModel, VK_USER_ID)
                        .then(function () {
                            deferred.resolve(User.deleteByVKId(usersModel, VK_USER_ID));
                        });

                    return assert.eventually.equal(
                        deferred.promise(),
                        User.ANSWER.DELETED,
                        "Answer should be equal User.ANSWER.NEW_USER"
                    );
                });
            });

            describe.only('Update methods', function () {

                it('should update user fields in model', function () {
                    var deferred = vow.defer(),
                        newFields = {
                            vkid: VK_USER_ID,
                            first_name: 'Петр',
                            last_name: 'Сагайдачный Ё е Ю Я'
                        };

                    User.createByVKId(usersModel, VK_USER_ID)
                        .then(function () {

                            var updatedFields = _.cloneDeep(newFields);

                            // Моделируем ситуацию, когда пытаются изменить vkid,
                            // он измениться не должен.
                            updatedFields.vkid = 5;

                            User.updateFieldsByVKId(usersModel, VK_USER_ID, updatedFields).then(function() {
                                User.getByVKId(usersModel, VK_USER_ID).then(function(updateUser) {
                                    var fields = _.mapValues(updateUser[0], function(val) {
                                        return val;
                                    });
                                    delete fields.id;
                                    deferred.resolve(fields);
                                });
                            });

                        });

                    return assert.eventually.deepEqual(
                        deferred.promise(),
                        newFields,
                        "Fields should be deep equal"
                    );
                });

            });

        });

        run();

    });

});
