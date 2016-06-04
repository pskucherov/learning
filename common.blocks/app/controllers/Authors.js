var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils'),
    ObjectID = require('mongodb').ObjectID;

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

/**
 * Найти автора по заданному параметру
 *
 * @param authorModel
 * @param query
 * @param userId
 *
 * @returns {*}
 */
Authors.findByQuery = function(authorModel, query, userId) {
    var deferred = vow.defer();

    authorModel
        .find({
            name: { $regex: new RegExp(query, 'i') },
            $or: [{ userId: userId }, { moderate: '1' }]
        })
        .only('_id', 'name')
        .limit(15).run(function (err, authors) {
        if (err) throw err;

        deferred.resolve(authors);
    });

    return deferred.promise();
};

/**
 * Получить идентификаторы авторов по заданному параметру.
 *
 * @param authorModel
 * @param author
 * @param userId
 * @returns {*}
 */
Authors.getIdsByQuery = function(authorModel, author, userId) {
    var deferred = vow.defer(),
        authorObj = {
            $or: [{ userId: userId }, { moderate: '1' }]
        };

    // Если автор не указан, то выбираем всех доступных пользователю авторов
    !_.isEmpty(author) && (authorObj.name = author);

    authorModel
        .find(authorObj)
        .only('_id', 'name')
        .run(function (err, authors) {
            if (err) throw err;

            var authorObj = {};

            _.forEach(authors, function(a) {
                authorObj[a._id] = a.name;
            });

            deferred.resolve(authorObj);
        });

    return deferred.promise();
};

module.exports = Authors;
