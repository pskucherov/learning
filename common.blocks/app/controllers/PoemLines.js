var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils'),
    BM25 = require('fts-js');

/**
 * Контроллер, для работы со строками стиха
 *
 * @returns {PoemLines}
 * @constructor
 */
var PoemLines = function() {
    return this;
};

/**
 * Добавить стихотворение построчно
 *
 * @param plModel
 * @param poemId
 * @param poemText
 * @returns {*}
 */
PoemLines.create = function(plModel, poemId, poemText) {
    var deferred = vow.defer();

    poemText = utils.formatEmptyLines(poemText);

    plModel.create(_.map(typeof poemText === 'string' ? poemText.split('\n') : poemText, function(line, k) {
        return {
            line_num: k,
            line: line,
            'fts-tokens': JSON.stringify(BM25.Tokenize(line)),
            nextEmpLine: false,
            poem_id: poemId
        };
    }), function (err, lines) {
        if (err) throw err;

        deferred.resolve(lines);
    });

    return deferred.promise();
};

module.exports = PoemLines;
