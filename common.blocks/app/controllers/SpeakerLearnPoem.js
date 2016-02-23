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
 * @param {String} act — завершённое действие в текущем шаге
 * @param userId
 * @returns {*}
 */
SpeakerLearnPoem.getDataOfProgressOrCreate = function(slpModel, poemId, act, userId) {
    var deferred = vow.defer();

    slpModel.find({ userId: userId, poem_id: poemId }).limit(1).run(function (err, progress) {
        if (err) throw err;

        if (_.isEmpty(progress)) {
            SpeakerLearnPoem.createProgress(slpModel, poemId, userId).then(function(progress) {
                progress.complitedSteps = utils.addStringInTextAfterComma(progress.complitedSteps, act);
                progress.save(function(err) {
                    if (err) throw err;
                    deferred.resolve(progress);
                });
            });
        } else {
            progress[0].complitedSteps = utils.addStringInTextAfterComma(progress[0].complitedSteps, act);
            progress[0].save(function(err) {
                if (err) throw err;
                deferred.resolve(progress[0]);
            });
        }
    });

    return deferred.promise();
};

/**
 * Зафиксировать прогресс в изучении стихотворения, если этого ещё не сделано и вернуть данные
 *
 * @param slpModel
 * @param poemId
 * @param userId
 * @returns {*}
 */
SpeakerLearnPoem.saveProgress = function(slpModel, poemId, act, userId) {
    var deferred = vow.defer();

    slpModel.find({ userId: userId, poem_id: poemId }).limit(1).run(function (err, progress) {
        if (err) throw err;

        if (_.isEmpty(progress)) {
            deferred.resolve([]);
        } else {
            if (!progress[0].deltaTime) {
                progress[0].deltaTime = progress[0].modified_at - progress[0].created_at;
                progress[0].save(function (err) {
                    if (err) throw err;
                    deferred.resolve(progress[0]);
                });
            } else {
                deferred.resolve(progress[0]);
            }
        }
    });

    return deferred.promise();
};

/**
 * Получить данные о прогрессе
 *
 * @param slpModel
 * @param userId
 * @returns {*}
 */
SpeakerLearnPoem.getDataOfProgress = function(slpModel, userId) {
    var deferred = vow.defer();

    slpModel
        .find({ userId: userId, finished: false })
        .limit(1)
        .orderRaw("?? DESC", ['modified_at'])
        .run(function (err, progress) {
            if (err) throw err;
            deferred.resolve(progress[0] || []);
        });

    return deferred.promise();
};


module.exports = SpeakerLearnPoem;
