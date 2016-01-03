var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils');

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
 * @returns {*}
 */
Poems.findAuthorByQuery = function(authorModel, query) {
    var deferred = vow.defer();

    // TODO: Добавить moderate = 0 OR userId = 123
    authorModel.find().where('name LIKE ? AND name != ? AND (moderate = "1")', ['%' + query + '%', query]).only('name').limit(5).run(function (err, authors) {
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
 * @returns {*}
 */
Poems.findPoemByAuthorANDQuery = function(pModel, query, author) {
    var deferred = vow.defer();

    //where('`poems`.`name` LIKE ? AND (`poems`.`moderate` = 1)', ['%' + query + '%', query]).only('id', 'name').limit(1)

    // TODO: Добавить moderate = 0 OR userId = 123
    pModel.findByAuthor({ name: author }).only('name', 'moderate', 'userId').each().filter(function (poem) {
        return poem.moderate === '1' && (new RegExp(query, 'im')).test(poem.name);
    }).get(function (poems) {
        deferred.resolve(poems);
    });

    return deferred.promise();
};

Poems.getPoemByNameAndAuthor = function(pModel, name, author) {
    var deferred = vow.defer();

    console.log(name, author);

    // TODO: Добавить moderate = 0 OR userId = 123
    pModel.findByAuthor({ name: author }).find({ name: name }).run(function (err, poems) {
        if (err) throw err;

        deferred.resolve(poems);
    });

    return deferred.promise();
};

module.exports = Poems;
