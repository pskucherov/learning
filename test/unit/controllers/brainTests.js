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
    BrainTests = require(path.resolve(appDir + 'controllers/BrainTests'));

models(function (err, db) {
    if (err) throw err;

    var BTestsModel = db.models['brain-tests'],
        BAnswersModel = db.models['brain-tests-answers'];

    db.sync(function (err) {
        if (err) throw err;

        describe('Controller: BrainTests', function () {

            beforeEach(function (done) {

                this.timeout(10000);

                db.driver.execQuery('DELETE FROM `brain-tests-answers`', function() {
                    done();
                });

            });

            describe('Get questions and answers', function () {

                it('should get random question for class', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 123;

                    BrainTests.getRandomQuestionForUser(BTestsModel, userId, classNum)
                        .then(function (data) {
                            deferred.resolve(data.id);
                        });

                    return assert.eventually.isAtMost(
                        deferred.promise(),
                        18,
                        'Question id is at most 18'
                    );

                });

                it('should get last not answered question for user', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 123;

                    db.driver.execQuery('INSERT INTO `brain-tests-answers` (userId, questionId) ' +
                        'VALUES (123, 4), (123, 10), (123, 17), (123, 14), (123, 18);', function() {

                        BrainTests.getRandomQuestionForUser(BTestsModel, userId, classNum)
                            .then(function (data) {
                                deferred.resolve(data.id);
                            });

                    });

                    return assert.eventually.equal(
                        deferred.promise(),
                        8,
                        'Question id equal last not answered'
                    );

                });

                it('should reject promise for user, because not answers', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 123;

                    db.driver.execQuery('INSERT INTO `brain-tests-answers` (userId, questionId) ' +
                        'VALUES (123, 4), (123, 8), (123, 10), (123, 17), (123, 14), (123, 18);', function() {

                        BrainTests.getRandomQuestionForUser(BTestsModel, userId, classNum)
                            .fail(function() { deferred.reject(); });
                    });

                    return assert.isRejected(
                        deferred.promise(),
                        'Should be rejected'
                    );

                });


            });

        });

        run();

    });

});
