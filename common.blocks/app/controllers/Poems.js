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

module.exports = Poems;
