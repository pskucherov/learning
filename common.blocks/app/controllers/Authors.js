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
    return new Promise((resolve, reject) => {
        Authors
            .getIdsByQuery(aModel, author, userId)
            .then((ids) => {
                let keys = Object.keys(ids);

                if (keys.length) {
                    resolve({
                        _id: keys[0],
                        name: ids[keys[0]],
                        userId: userId
                    });
                } else {
                    aModel.create({
                        name: author,
                        userId: utils.oId(userId),
                        moderate: '0'
                    }, function (err, author) {
                        if (err) throw err;
                        resolve(author);
                    });
                }
            });
    });
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
            $or: [{ userId: utils.oId(userId) }, { moderate: '1' }]
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
            $or: [{ userId: utils.oId(userId) }, { moderate: '1' }]
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

/**
 * Получить автора по  id
 *
 * @param authorModel
 * @param authorId
 */
Authors.getById = function(authorModel, authorId) {
    var deferred = vow.defer();

    authorModel
        .find({_id: utils.oId(authorId)})
        .only('_id', 'name')
        .run(function (err, author) {
            if (err) throw err;

            deferred.resolve(author && author[0] || []);
        });

    return deferred.promise();
};

module.exports = Authors;
