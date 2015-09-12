/**
 * Возвращает bemjson страницы в зависимости от типа запроса.
 *
 * @param {GlobalObject} data
 *
 * @returns {Object}
 */
blocks['i-response'] = function(data) {
    var bemjson = [];

    if (!data.isAjaxRequest) {
        bemjson.push(blocks['header'](data));
    }

    bemjson.push(blocks['page'](data));

    if (!data.isAjaxRequest) {
        bemjson.push(blocks['footer'](data));
    }

    return bemjson;
};
