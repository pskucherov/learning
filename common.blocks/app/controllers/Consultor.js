var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    User = require('./User'),
    utils = require('../utils');

/**
 * Контроллер, для работы с вопросами
 *
 * @returns {Consultor}
 * @constructor
 */
var Consultor = function() {
    return this;
};

/**
 * Добавить вопрос
 *
 * @param cModel
 * @param question
 * @param userId
 * @returns {*}
 */
Consultor.create = function(cModel, question, userId) {
    var deferred = vow.defer();

    cModel.create({
        question: question,
        userId: utils.oId(userId),
        moderate: '0'
    }, function (err, question) {
        if (err) throw err;
        deferred.resolve(question);
    });

    return deferred.promise();
};

/**
 * Получает все вопросы, заданные пользователями
 *
 * @param cModel
 *
 * @returns {Promise}
 */
Consultor.getAllQuestions = function(db) {
    var deferred = vow.defer();

    db.models['s-consultor'].proxy('aggregate', 's-consultor', [[
        { $sort : { created_at: -1 } }
    ], function (err, data) {
        if (err) throw err;

        User.getByIdKeyValue(db.models['users'], _.map(data, u => utils.oId(u.userId))).then(users => {

            deferred.resolve(_.map(data, question => {
                question.user = users[utils.oId(question.userId)];
                return question;
            }));

        });


    }]);

    return deferred.promise();
};

module.exports = Consultor;
