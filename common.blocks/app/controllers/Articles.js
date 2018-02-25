var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils');

const cyrillicToTranslit = require('cyrillic-to-translit-js');

/**
 * Контроллер, для работы с авторами
 *
 * @returns {Articles}
 * @constructor
 */
var Articles = function() {
    return this;
};

/**
 * Коды ответов методов.
 *
 * @type {{NEW_USER: number, OLD_USER: number}}
 */
Articles.ANSWER = {
    CREATED: 0,
    UPDATED: 1,
    DELETED: 2
};

/**
 * Добавить автора
 *
 * @param aModel
 * @param author
 * @param userId
 * @returns {*}
 */
Articles.create = function(aModel, data, userId) {
    return new Promise((resolve, reject) => {
        let title, titleId, keywords, description, text;

        ({ title, keywords, description, text } = data.content);
        titleId = cyrillicToTranslit().transform(title);


        aModel.find({ title_id: { $in: [titleId] } }).run(function(err, article) {
            if (err) throw err;

            if (_.isEmpty(article)) {
                aModel.create({
                    title,
                    title_id: titleId,
                    keywords,
                    description,
                    text,
                    userId: utils.oId(userId)
                }, function (err, author) {
                    if (err) throw err;
                    resolve(Articles.ANSWER.CREATED);
                });
            } else {
                _.forEach(data, function(value, key) {
                    // Если такое поле существует в моделе — сохраняем его.
                    // Удаляем уникальные поля, т.к. их нелья редактировать.
                    if (!_.isUndefined(article[0][key]) && key !== '_id') {
                        article[0][key] = data[key];
                    }
                });

                article[0].save(function (err) {
                    if (err) throw err;

                    resolve(Articles.ANSWER.UPDATED);
                });
            }
        });
    });
};


module.exports = Articles;