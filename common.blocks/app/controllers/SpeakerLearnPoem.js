var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils');

/**
 * Контроллер, для работы с записями о прогрессе в изучении стихотворений
 *
 * @returns {SpeakerLearnPoem}
 * @constructor
 */
var SpeakerLearnPoem = function() {
    return this;
};


/**
 * Создать запись о начале изучении стихотворения
 *
 * @param slpModel
 * @param poemId
 * @param userId
 */
SpeakerLearnPoem.createProgress = function(slpModel, poemId, userId) {
    var deferred = vow.defer();

    slpModel.create({
        userId: userId,
        poem_id: poemId
    }, function (err, progress) {
        if (err) throw err;
        deferred.resolve(progress);
    });

    return deferred.promise();
};

/**
 * Получить данные о прогрессе в изучении стихотворения или создать его.
 *
 * @param slpModel
 * @param poemId
 * @param userId
 * @returns {*}
 */
SpeakerLearnPoem.getDataOfProgressOrCreate = function(slpModel, poemId, userId) {
    var deferred = vow.defer();

    slpModel.find({ userId: userId, poem_id: poemId }).limit(1).run(function (err, progress) {
        if (err) throw err;

        if (_.isEmpty(progress)) {
            SpeakerLearnPoem.createProgress(slpModel, poemId, userId).then(function(progress) {
                deferred.resolve(progress);
            });
        } else {
            deferred.resolve(progress[0]);
        }
    });

    return deferred.promise();
};

module.exports = SpeakerLearnPoem;
