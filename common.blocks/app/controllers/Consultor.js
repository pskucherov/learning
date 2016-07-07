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

/**
 * Получает вопрос по id
 *
 * @param cModel
 *
 * @returns {Promise}
 */
Consultor.getById = function(cModel, id) {
    var deferred = vow.defer();

    cModel
        .find({_id: utils.oId(id)})
        .run(function (err, question) {
            if (err) throw err;

            deferred.resolve(question && question[0] || []);
        });

    return deferred.promise();
};

/**
 * Обновить количество лайков у вопроса
 *
 * @param cModel
 * @param id
 * @param count
 * @returns {*}
 */
Consultor.updateLikeCount = function(cModel, id, count) {
    var deferred = vow.defer();

    cModel
        .find({_id: utils.oId(id)})
        .run(function (err, question) {
            if (err) throw err;

            if (question.length) {
                question[0].likeCount = count;
                question[0].save();
            }
        });

    return deferred.promise();
};

/**
 * Обновить количество комментариев у вопроса
 *
 * @param cModel
 * @param id
 * @param count
 * @returns {Promise}
 */
Consultor.updateCommentsCount = function(cModel, id, count) {
    return new Promise((resolve, reject) => {
        cModel
            .find({_id: utils.oId(id)})
            .run(function (err, question) {
                if (err) throw err;

                if (question.length) {
                    question[0].answersCount = count;
                    question[0].save();
                }
            });
    });
};


module.exports = Consultor;
