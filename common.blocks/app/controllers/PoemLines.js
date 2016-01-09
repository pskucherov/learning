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
    var deferred = vow.defer(),
        prepareObjectToCreate,
        finalText,
        lineNum = 0;

    poemText = utils.formatEmptyLines(poemText);

    finalText = typeof poemText === 'string' ? poemText.split('\n') : poemText;

    prepareObjectToCreate = _.chain(finalText)
        .map(function(line, k) {
            return _.isEmpty(line) ? '' : {
                line_num: lineNum++,
                line: line,
                'fts-tokens': JSON.stringify(BM25.Tokenize(line)),
                nextEmpLine: !_.isUndefined(finalText[k + 1]) && _.isEmpty(finalText[k + 1]),
                poem_id: poemId
            };
        })
        .filter(function(item) {
            return !_.isEmpty(item);
        })
        .value();

    plModel.create(prepareObjectToCreate, function (err, lines) {
        if (err) throw err;

        deferred.resolve(lines);
    });

    return deferred.promise();
};

module.exports = PoemLines;
