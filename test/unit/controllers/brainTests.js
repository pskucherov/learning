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
    utils = require(path.resolve(appDir + 'utils')),
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

                var classNum = 1;
                this.timeout(10000);
                BAnswersModel.find().remove(function (err) {
                BTestsModel.find().remove(function (err) {

                    db.models['brain-tests'].create([
                        {
                            _id: utils.oId('a12345678904'),
                            class: 1,
                            name: 'Живая и неживая природа',
                            descr: 'Проверка знаний по теме: "Живая и неживая природа"',
                            question: 'Какое выражение правильно? природой называют всё то, ...',
                            answers: 'Что сделано руками человека;||Что окружает человека и не сделано его руками.||Что окружает человека;',
                            rightanswernum: 1,
                            subj_id: 13
                        },
                        {
                            _id: utils.oId('a12345678908'),
                            class: 1,
                            name: 'Сколько слогов в слове?',
                            descr: 'Проверить навыки определения количества слогов в слове.',
                            question: 'Сколько слогов в слове?\r\n<bR>\r\n<a href="http://radikall.com/ZW2d" target="_blank"><img src="http://radikall.com/images/2014/04/05/BGyev.th.png" border="0" alt="Radikal" /></a>',
                            answers: '1||2||3||4',
                            rightanswernum: 2,
                            subj_id: 15
                        },
                        {
                            _id: utils.oId('a12345678910'),
                            class: 1,
                            name: 'Задачи на разностное сравнение',
                            descr: 'Проверка умения решать задачи на разностное сравнение',
                            question: 'Выбери правильный ответ.',
                            answers: 'Чтобы узнать, на сколько одно число больше или меньше другого, надо из большего числа вычесть меньшее.||Чтобы узнать, на сколько одно число больше или меньше другого, надо к большему числу прибавить меньшее.',
                            rightanswernum: 0,
                            subj_id: 8
                        },
                        {
                            _id: utils.oId('a12345678914'),
                            class: 1,
                            name: 'Тест по Правилам дорожного движения',
                            descr: 'Данный тест позволит проверить знания учащихся по Правилам дорожного движения.',
                            question: 'Кого называют пешеходом?',
                            answers: 'Человек вне транспорта, находящийся на дороге, но не работающий на ней.||Человек вне транспорта, находящийся на дороге.||Человек внутри транспорта.',
                            rightanswernum: 0,
                            subj_id: 11
                        },
                        {
                            _id: utils.oId('a12345678917'),
                            class: 1,
                            name: 'Доброта',
                            descr: 'Викторина на тему "Доброта"',
                            question: 'Как звали злую старушку, которая пела: "Кто людям помогает, тот тратит время зря"?',
                            answers: 'Снежная королева||Домоправительница||Шапокляк',
                            rightanswernum: 2,
                            subj_id: 7
                        },
                        {
                            _id: utils.oId('a12345678918'),
                            class: 1,
                            name: 'Доброта',
                            descr: 'Викторина на тему "Доброта"',
                            question: 'Как звали злую старушку, которая пела: "Кто людям помогает, тот тратит время зря"?',
                            answers: 'Снежная королева||Домоправительница||Шапокляк',
                            rightanswernum: 2,
                            subj_id: 7
                        }
                    ], function (err) {
                        err && console.log("\n\n\ err ", err);

                        done();
                    });
                });

                });

            });

            describe('Get and set questions and answers', function () {

                it('should get random question for class', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 'a12345678901',
                        questions = [];

                    BrainTests.getRandomQuestionForUser(db, userId, classNum)
                        .then(function (data) {
                            questions.push(data._id);

                            // Тест может только зарезолвится, если нет, то падает по таймауту
                            var interval = setInterval(() => {
                                BrainTests.getRandomQuestionForUser(db, userId, classNum)
                                    .then(function (data) {
                                        questions.push(data._id);
                                    });

                                if (_.uniq(questions).length > 2) {
                                    deferred.resolve(_.uniq(questions).length);
                                    clearInterval(interval);
                                }
                            }, 75);

                        });

                    return assert.eventually.isAtLeast(
                        deferred.promise(),
                        3,
                        'Arr length is at most 2'
                    );

                });

                it('should get last not answered question for user', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 'a12345678901';

                        BTestsModel.proxy('insertMany', 'brain-tests-answers', [
                            [
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: utils.oId('a12345678904')
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: utils.oId('a12345678908')
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: utils.oId('a12345678910')
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: utils.oId('a12345678917')
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: utils.oId('a12345678914')
                                }
                            ], function () {
                                BrainTests.getRandomQuestionForUser(db, userId, classNum)
                                    .then(function (data) {
                                        deferred.resolve(data._id);
                                    }).catch((e) => deferred.resolve(e));
                            }]);

                    return assert.eventually.equal(
                        deferred.promise(),
                        utils.oId('a12345678918'),
                        'Question id equal last not answered'
                    );

                });

                it('should reject promise for user, because not answers', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 'a12345678901';

                        BTestsModel.proxy('insertMany', 'brain-tests-answers', [
                            [
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: 4
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: 8
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: 10
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: 17
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: 14
                                },
                                {
                                    userId: utils.oId('a12345678901'),
                                    classNum: classNum,
                                    questionId: 18
                                }
                            ], function () {
                                BrainTests.getRandomQuestionForUser(db, userId, classNum)
                                    .catch(() => deferred.reject());

                            }]);



                    return assert.isRejected(
                        deferred.promise(),
                        'Should be rejected'
                    );

                });

                it('should create answer row', function () {

                    var deferred = vow.defer(),
                        isRight = 1,
                        questionId = 18,
                        userId = 'a12345678901';

                    BrainTests.createAnswerRow(BAnswersModel, userId, questionId, isRight)
                        .then(function () {
                            deferred.resolve();
                        });

                    return assert.isFulfilled(
                        deferred.promise(),
                        'Should be resolved'
                    );

                });

                it('should get right count answers', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 'a12345678901';

                    BTestsModel.proxy('insertMany', 'brain-tests-answers', [
                        [
                            {
                                userId: utils.oId('a12345678901'),
                                classNum: classNum,
                                questionId: 4,
                                answer: true
                            },
                            {
                                userId: utils.oId('a12345678901'),
                                classNum: classNum,
                                questionId: 10,
                                answer: true
                            }
                            ,
                            {
                                userId: utils.oId('a12345678901'),
                                classNum: classNum,
                                questionId: 17,
                                answer: true
                            }
                            ,
                            {
                                userId: utils.oId('a12345678901'),
                                classNum: classNum,
                                questionId: 14,
                                answer: true
                            }
                        ], function () {
                            BrainTests.getStatsForUserClass(BAnswersModel, userId, classNum, true)
                                .then(function (rightAnswer) {
                                    deferred.resolve(rightAnswer);
                                });
                        }]);

                    return assert.eventually.equal(
                        deferred.promise(),
                        4,
                        'Shouild be equal 4'
                    );

                });

                it('should get false count answers', function () {

                    var deferred = vow.defer(),
                        classNum = 1,
                        userId = 'a12345678901';

                    BTestsModel.proxy('insertMany', 'brain-tests-answers', [
                        [
                            {
                                userId: utils.oId('a12345678901'),
                                questionId: 8,
                                classNum: classNum,
                                answer: false
                            },
                            {
                                userId: utils.oId('a12345678901'),
                                questionId: 18,
                                classNum: classNum,
                                answer: false
                            }
                        ], function () {
                            BrainTests.getStatsForUserClass(BAnswersModel, userId, classNum, false)
                                .then(falseAnswer => deferred.resolve(falseAnswer));
                        }]);

                    return assert.eventually.equal(
                        deferred.promise(),
                        2,
                        'Shouild be equal 2'
                    );

                });
            });

        });

        run();

    });

});
