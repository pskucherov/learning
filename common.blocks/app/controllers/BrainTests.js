var vow = require('vow'),
    _ = require('lodash'),
    User = require('./User'),
    path = require('path'),
    utils = require('../utils');

/**
 * Контроллер, для работы с тестами
 *
 * @returns {BrainTests}
 * @constructor
 */
var BrainTests = function() {
    return this;
};

/**
 * Возвращает вопрос для заданного класса, на который пользователь ещё не отвечал
 *
 * @param BTestsModel
 * @param {Number} userId - id пользователя
 * @param {Number} classNum - класс [1..11]
 *
 * @returns {Promise}
 */
BrainTests.getRandomQuestionForUser = function(BTestsModel, userId, classNum) {
    var deferred = vow.defer();

    BTestsModel.find({ class: classNum })
        .where('id NOT IN (SELECT questionId FROM `brain-tests-answers` WHERE userId = ?)', [userId])
        .orderRaw('rand()').limit(1).run(function (err, data) {

        if (err) throw err;

        if (_.isEmpty(data)) {
            deferred.reject([]);
        } else {
            deferred.resolve(data[0]);
        }

    });

    return deferred.promise();
};

/**
 * Создать запись в таблице об ответе пользователя
 *
 * @param BAnswersModel
 * @param {Number} userId
 * @param {Number} questionId
 * @param {Boolean} isRight
 * @returns {*}
 */
BrainTests.createAnswerRow = function(BAnswersModel, userId, questionId, isRight) {
    var deferred = vow.defer();

    BAnswersModel.create({
        userId: userId,
        questionId: questionId,
        answer: isRight
    }, function (err) {
        if (err) throw err;

        deferred.resolve();
    });

    return deferred.promise();
};

/**
 * Получить количество ответов для данного класса.
 *
 * @param BAnswersModel
 * @param {Number} userId
 * @param {Number} classNum
 * @param {Number} toRightAnswer [0|1] - получить количество правильных или не правильных ответов
 *
 * @returns {*}
 */
BrainTests.getStatsForUserClass = function(BAnswersModel, userId, classNum, toRightAnswer) {
    var deferred = vow.defer();

    BAnswersModel.find({ userId: userId, answer: toRightAnswer })
        .where('questionId IN (SELECT id FROM `brain-tests` WHERE class = ?)', [classNum])
        .count(function(err, data) {
            if (err) throw err;
            deferred.resolve(data);
        });

    return deferred.promise();
};


/**
 * Получить первый трёх человек из рейтинга
 *
 * @param db
 * @returns {*}
 */
BrainTests.getStatsRating = function(db, userId, classNum) {
    var deferred = vow.defer();

    db.driver.execQuery('SELECT @i:=@i+1 AS `RowNumber`, userId, cnt '
        + 'FROM (SELECT userId, COUNT(*) as cnt '
        + 'FROM `brain-tests-answers`, (SELECT @i:=0) AS `RowNumberTable` WHERE (`questionId` IN (SELECT id FROM `brain-tests` WHERE `class` = "' + classNum + '") AND answer=1)'
        + ' GROUP BY userId ORDER BY cnt DESC)x '
        + ' LIMIT 3',
        function(err, data) {

            if (err) throw err;


            if (_.isEmpty(data)) {
                deferred.reject(data);
            } else {

                // Если юзер есть в одном из трёх первых, то возвращаем их и выходим
                for (var k in data) {
                    if (data[k]['userId'] === userId) {
                        deferred.resolve(data);
                        return;
                    }
                }

                BrainTests.getStatsForUserClass(db.models['brain-tests-answers'], userId, classNum, 1)
                    .then(function(uStat) {
                        if (!_.isEmpty(uStat)) {
                            data.push(uStat[0]);
                        }
                        deferred.resolve(data);
                    });

            }
        });

    return deferred.promise();
};


/**
 * Получить стату для пользователя.
 *
 * TODO: тут ещё надо будет всё перепроверить и написать тестов.
 *
 * @param db
 * @param userId
 * @param classNum
 * @returns {*}
 */
BrainTests.getUserForStat = function(db, userId, classNum) {
    var deferred = vow.defer();

    BrainTests.getStatsRating(db, userId, classNum).then(function (uStat) {

        var userIds = [];

        for (var k in uStat) {
            userIds.push(uStat[k].userId);
        }

        User.getById(db.models['users'], userIds, 'id,vkid,first_name,photo_100').then(function(users) {
            for (var i in uStat) {
                for (var k in users) {
                    if (uStat[i].userId === users[k].id) {
                        uStat[i].user = users[k];
                    }
                }
            }

            deferred.resolve(uStat);
        });

    });

    return deferred.promise();
};


module.exports = BrainTests;
