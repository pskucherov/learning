var vow = require('vow'),
    _ = require('lodash'),
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

module.exports = BrainTests;
