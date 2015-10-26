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
    User = require(path.resolve(appDir + 'controllers/User'));

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

            describe('Update methods', function () {

                it('should update user fields in model', function () {
                    var deferred = vow.defer(),
                        newFields = {
                            vkid: VK_USER_ID,
                            first_name: 'Петр',
                            last_name: 'Сагайдачный Ё е Ю Я',
                            sex: 1,
                            photo_50: 'photo_50',
                            photo_100: 'photo_100',
                            photo_200_orig: 'photo_200_orig',
                            photo_200: 'photo_200',
                            has_mobile: true,
                            access_token: 'access_token'
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

                it('should end, if not update', function () {
                    var deferred = vow.defer(),
                        newFields = {
                            vkid: VK_USER_ID,
                            first_name: '',
                            last_name: ''
                        };

                    User.createByVKId(usersModel, VK_USER_ID)
                        .then(function () {
                            var updatedFields = _.cloneDeep(newFields);

                            User.updateFieldsByVKId(usersModel, (VK_USER_ID+1), updatedFields)
                                .fail(function() { deferred.reject(); });
                        });

                    return assert.isRejected(
                        deferred.promise(),
                        'Should be rejected'
                    );
                });

            });

        });

        describe('Auth methods', function () {

            it('should create same sig', function () {
                var sid = 'expire=1445896013&mid=31152722&secret=oauth&sid=c8fc6beacd7f172b4710fdff8e98111ce8660a07e3a960a1adaef46059ca937aa71ecbd6c65ad1997ba84&sig=09fd6b3559738f36e2679f2f0644db68';

                assert.isTrue(User._authOpenAPIMember(sid));
            });

        });

        run();

    });

});
