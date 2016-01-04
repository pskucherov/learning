var vow = require('vow'),
    _ = require('lodash');

/**
 * Сборная методов
 *
 * @returns {Utils}
 * @constructor
 */
var Utils = function() {
    return this;
};

/**
 * Возвращает поля для выборки пользователя из БД,
 * чтобы ненароком не вернуть сверхважную инфу
 *
 * @param fields
 * @returns {String[]}
 */
// TODO: для этого в orm есть метод only
Utils.parseUserFields = function(fields) {
    if (_.isEmpty(fields)) {
        fields = 'id,vkid,first_name';
    }

    if (typeof fields === 'string') {
        fields = fields.split(',');
    }

    return fields;
};

/**
 * Форматировать текст, чтобы в нём было больше одной пустой строки подряд
 *
 * @param {String|String[]} text
 *
 * @returns {String|String[]}
 */
Utils.formatEmptyLines = function(text) {
    var isString = typeof text === 'string',
        temp = isString
            ? _.trim(text).split('\n')
            : text,
        i;

    Utils._cutEmptyLines(temp, false);
    Utils._cutEmptyLines(temp, true);

    if (temp.length > 1) {
        i = 0;

        // Объединяем две пустые строки в одну
        while(i < temp.length) {
            while(_.isEmpty(temp[i]) && _.isEmpty(temp[i+1]) && !_.isUndefined(temp[i+1])) {
                temp.splice((i + 1), 1);
            }
            temp[i] = _.trim(temp[i]);
            ++i;
        }

    }

    return isString
        ? temp.join('\n')
        : temp;
};

/**
 * Удалить пустые строки из начала или из конца массива
 * Модифицирует входные данные!
 *
 * @param {String[]} text
 * @param {Boolean} atBegin
 *
 * @private
 */
Utils._cutEmptyLines = function(text, atBegin) {
    var i = atBegin ? 0 : text.length - 1;

    text[i] = _.trim(text[i]);
    while(_.isEmpty(text[i]) && !_.isUndefined(text[i])) {
        text.splice(i, 1);
        atBegin || (i = text.length - 1);
        text[i] = _.trim(text[i]);
    }

};


module.exports = Utils;
