var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
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

module.exports = Consultor;