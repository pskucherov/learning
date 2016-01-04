var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils');

/**
 * Контроллер, для работы с авторами
 *
 * @returns {Authors}
 * @constructor
 */
var Authors = function() {
    return this;
};

/**
 * Добавить автора
 *
 * @param aModel
 * @param author
 * @param userId
 * @returns {*}
 */
Authors.create = function(aModel, author, userId) {
    var deferred = vow.defer();

    aModel.create({
        name: author,
        userId: userId,
        moderate: '0'
    }, function (err, author) {
        if (err) throw err;
        deferred.resolve(author);
    });

    return deferred.promise();
};

module.exports = Authors;
