var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils'),
    orm = require('orm'),
    BM25 = require('fts-js'),
    Authors = require('./Authors');

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
 * @param {String} poem
 *
 * @returns {*}
 */
Poems.create = function(pModel, name, authorId, userId, poem) {
    var deferred = vow.defer();

    pModel.proxy('insertOne', 'poems', [{
        name: name,
        author_id: utils.oId(authorId),
        class: 0,
        userId: utils.oId(userId),
        moderate: '0',
        poem: this._getLinesFromPoem(poem)
    }, function (err) {
        if (err) throw err;

        deferred.resolve(true);
    }]);

    return deferred.promise();
};

/**
 * Подготавливает текст стихотворения для добавления в БД в виде строк с полнотекстовым поиском
 *
 * @param poemText
 * @returns {*}
 * @private
 */
Poems._getLinesFromPoem = function(poemText) {
    var finalText,
        lineNum = 0;

    poemText = utils.formatEmptyLines(poemText);

    finalText = typeof poemText === 'string' ? poemText.split('\n') : poemText;

    return _.chain(finalText)
        .map(function(line, k) {
            return _.isEmpty(line) ? '' : {
                line_num: lineNum++,
                line: line,
                'fts-tokens': JSON.stringify(BM25.Tokenize(line)),
                nextEmpLine: !_.isUndefined(finalText[k + 1]) && _.isEmpty(finalText[k + 1])
            };
        })
        .filter(function(item) {
            return !_.isEmpty(item);
        })
        .value();
};

/**
 * Получить стихотворение из БД по id
 *
 * @param pModel
 * @param authorModel
 * @param poemId
 * @returns {*}
 */
Poems.getById = function(pModel, authorModel, poemId) {
    var deferred = vow.defer();

    pModel.find({ _id: utils.oId(poemId) }).limit(1).run(function (err, poem) {
        if (err) throw err;

        if (_.isEmpty(poem)) {
            deferred.reject([]);
        } else {
            var poemItem = poem[0];

            Authors
                .getById(authorModel, poemItem.author_id)
                .then(function(author) {
                    poemItem.author = author;

                    deferred.resolve(poemItem);
                });
        }
    });

    return deferred.promise();
};

/**
 * Удалить стихотворение по id,
 * если такого автора больше нет, то и его удалить
 *
 * @param pModel
 * @param authorModel
 * @param poemId
 * @returns {*}
 */
Poems.delByIdWithAuthor = function(pModel, authorModel, poemId) {
    var deferred = vow.defer();

    pModel.find({ _id: utils.oId(poemId) }).run((err, poem) => {
        if (!_.isEmpty(poem)) {
            poem = poem[0];

            pModel.find({ author_id: utils.oId(poem.author_id) }).count((err, count) => {
                // Значит найден только этот стих и автора так же можно удалить
                if (count === 1) {
                    Authors
                        .delById(authorModel, poem.author_id)
                        .then(() => {
                            Poems.delById(pModel, poemId).then(() => deferred.resolve(true));
                        });
                } else {
                    Poems.delById(pModel, poemId).then(() => deferred.resolve(true));
                }
            })

        } else {
            deferred.resolve(false);
        }
    });

    return deferred.promise();
};

/**
 * Удалить стихотворение по id
 *
 * @param pModel
 * @param poemId
 * @returns {*}
 */
Poems.delById = function(pModel, poemId) {
    var deferred = vow.defer();

    pModel.find({ _id: utils.oId(poemId) }).remove(() => {
        deferred.resolve(true);
    });

    return deferred.promise();
};

/**
 * Найти стих по автору и названию
 *
 * @param pModel
 * @param authorModel
 * @param query
 * @param {String} author
 * @param userId
 *
 * @returns {*}
 */
Poems.findPoemByAuthorANDQuery = function(pModel, authorModel, query, author, userId) {
    var deferred = vow.defer();

    Authors
        .getIdsByQuery(authorModel, author, userId)
        .then(function(authorIds) {

            pModel
                .find({
                    name: { $regex: new RegExp(query, 'i') },
                    author_id: { $in: _.map(authorIds, function(a, k) { return utils.oId(k); }) },
                    $or: [{ userId: userId }, { moderate: '1' } ]
                })
                .only('_id', 'name', 'author_id')
                .limit(15)
                .run(function (err, poems) {
                    if (err) throw err;

                    _.forEach(poems, function(p, k) {
                        poems[k].author = { name: authorIds[p.author_id] };
                    });

                    deferred.resolve(poems);
                });
        });

    return deferred.promise();
};

/**
 * Получить стих по точному вхождению названию и автора
 *
 * @param pModel
 * @param authorModel
 * @param {String} name
 * @param {String} author
 * @param userId
 * @returns {*}
 */
Poems.getPoemByNameAndAuthor = function(pModel, authorModel, name, author, userId) {
    var deferred = vow.defer();

    Authors
        .getIdsByQuery(authorModel, author, userId)
        .then(function(authorIds) {

            pModel.proxy('findOne', 'poems', [
                {
                    name: name,
                    author_id: { $in: _.map(authorIds, function(a, k) { return utils.oId(k); }) },
                    $or: [{userId: utils.oId(userId)}, {moderate: '1'}]
                }, function(err, poem) {
                    if (err) throw err;

                    if (!_.isEmpty(authorIds) && !_.isEmpty(poem)) {
                        poem.author = {name: authorIds[poem.author_id]};
                    }

                    deferred.resolve(poem);
                }
            ]);
        });

    return deferred.promise();
};

/**
 * Получить все непромодерированные стихотворение из БД
 *
 * @param pModel
 * @param authorModel
 * @returns {*}
 */
Poems.getUnverified = function(pModel, authorModel) {
    var deferred = vow.defer();

    pModel.find({ moderate: '0' }).run(function (err, poems) {
        if (err) throw err;

        if (_.isEmpty(poems)) {
            deferred.reject([]);
        } else {

            function getNext(i) {

                if (!_.isEmpty(poems[i])) {
                    Authors
                        .getById(authorModel, poems[i].author_id)
                        .then(function(author) {
                            poems[i].author = author;

                            getNext(i+1);
                        });
                } else {
                    deferred.resolve(poems);
                }
            }

            getNext(0);

        }
    });

    return deferred.promise();
};


module.exports = Poems;
