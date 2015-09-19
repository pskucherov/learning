/**
 * Возвращает bemjson страницы в зависимости от типа запроса.
 *
 * @param {GlobalObject} data
 *
 * @returns {Object}
 */
blocks['i-response'] = function(data) {
    var bemjson = [];

    bemjson.push(blocks['page'](data));

    return bemjson;
};
