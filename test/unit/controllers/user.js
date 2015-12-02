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
        VK_USER_ID_1 = 101,
        VK_USER_ID_2 = 102,
        usersModel = db.models.users;

    db.sync(function (err) {
        if (err) throw err;

        describe('Controller: user', function () {

            beforeEach(function (done) {

                this.timeout(10000);

                User.deleteByVKId(usersModel, [VK_USER_ID, VK_USER_ID_1, VK_USER_ID_2]).then(function () {
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

                it('should get several users from BD', function () {
                    var deferred = vow.defer();

                    db.driver.execQuery("INSERT INTO `users` (vkid) VALUES (" + VK_USER_ID + "), (" + VK_USER_ID_1 + "), (" + VK_USER_ID_2 + "); ", function() {

                        User.getByVKId(usersModel, [VK_USER_ID, VK_USER_ID_1, VK_USER_ID_2])
                            .then(function (users) {
                                deferred.resolve(users);
                            });

                    });

                    return assert.eventually.lengthOf(
                        deferred.promise(),
                        3,
                        "should returns 3 users"
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
                            access_token: 'access_token',
                            lastvisit: 5,
                            email: 'qwe@qwe.qwe',
                            class: 3
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

                                    // Удаляем автосгенерированные поля таблицы
                                    delete fields.created_at;
                                    delete fields.modified_at;
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

            describe('Calc rating methods', function () {

                it('should return points in one percent', function () {

                    var deferred = vow.defer();

                    db.driver.execQuery("DELETE FROM `brain-tests-answers` WHERE userId IN (123, 124, 125); ", function() {
                        db.driver.execQuery("INSERT INTO `brain-tests-answers` (userId, answer) VALUES (123, 1), (123, 1), (123, 0), (123, 0)," +
                            "(124, 1), (124, 1), (124, 0), (124, 0), " +
                            "(125, 1), (125, 1), (125, 1), (125, 0);",
                            function () {
                                deferred.resolve(User.getPointInOneProcent(db, '123,124,125'));
                            });
                    });

                    return assert.eventually.equal(
                        deferred.promise(),
                        0.03,
                        "Points should be equal 0.03 (3 / 100)"
                    );

                });

            });

        });

        run();

    });

});
