var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils'),
    orm = require('orm');

/**
 * Контроллер, для работы со стихами
 *
 * @returns {Poems}
 * @constructor
 */
var Poems = function() {
    return this;
};

/**
 * Добавить стихотворение
 *
 * @param pModel
 * @param name
 * @param authorId
 * @param userId
 *
 * @returns {*}
 */
Poems.create = function(pModel, name, authorId, userId) {
    var deferred = vow.defer();

    pModel.create({
        name: name,
        author_id: authorId,
        class: 0,
        userId: userId,
        moderate: '0'
    }, function (err, poem) {
        if (err) throw err;
        deferred.resolve(poem);
    });

    return deferred.promise();
};

/**
 * Получить стихотворение из БД по id
 *
 * @param pModel
 * @param poemId
 * @returns {*}
 */
Poems.getPoemById = function(pModel, poemId) {
    var deferred = vow.defer();

    pModel.find({ id: poemId }).limit(1).run(function (err, poem) {
        if (err) throw err;

        if (_.isEmpty(poem)) {
            deferred.reject([]);
        } else {
            deferred.resolve(poem[0]);
        }
    });

    return deferred.promise();
};

/**
 * Найти автора по заданному параметру
 *
 * @param pModel
 * @param query
 * @param userId
 * @returns {*}
 */
Poems.findAuthorByQuery = function(authorModel, query, userId) {
    var deferred = vow.defer();

    authorModel
        .find({
            name: orm.like('%' + query + '%'),
            or: [{ userId: userId }, { moderate: '1' }]
        })
        .only('name').limit(15).run(function (err, authors) {
            if (err) throw err;

            deferred.resolve(authors);
        });

    return deferred.promise();
};

/**
 * Найти стих по автору и названию
 *
 * @param pModel
 * @param query
 * @param {String} author
 * @param userId
 *
 * @returns {*}
 */
Poems.findPoemByAuthorANDQuery = function(pModel, query, author, userId) {
    var deferred = vow.defer();

    pModel
        .findByAuthor({
            name: author,
            or: [{ userId: userId }, { moderate: '1' }]
        })
        .find({
            name: orm.like('%' + query + '%'),
            or: [{ userId: userId }, { moderate: '1' }]
        })
        .only('name', 'moderate', 'userId')
        .limit(15)
        .run(function(err, poems) {
            deferred.resolve(poems);
        });

    return deferred.promise();
};

/**
 * Получить стих по точному вхождению названию и автора
 *
 * @param pModel
 * @param {String} name
 * @param {String} author
 * @param userId
 * @returns {*}
 */
Poems.getPoemByNameAndAuthor = function(pModel, name, author, userId) {
    var deferred = vow.defer();

    // TODO: Добавить moderate = 0 OR userId = 123
    pModel
        .findByAuthor({
            name: author,
            or: [{ userId: userId }, { moderate: '1' }]
        }).find({
            name: name,
            or: [{ userId: userId }, { moderate: '1' }]
        }).limit(1).run(function (err, poems) {
            if (err) throw err;
            deferred.resolve(poems);
        });

    return deferred.promise();
};

module.exports = Poems;
