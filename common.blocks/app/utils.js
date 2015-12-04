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
Utils.parseUserFields = function(fields) {
    if (_.isEmpty(fields)) {
        fields = 'id,vkid,first_name';
    }

    if (typeof fields === 'string') {
        fields = fields.split(',');
    }

    return fields;
};

module.exports = Utils;
