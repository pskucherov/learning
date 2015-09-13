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
        bemjson.push(BEMPRIV.json('header', data, { branch: 'release' }));
    }

    bemjson.push(blocks['page'](data));

    if (!data.isAjaxRequest) {
        //bemjson.push(blocks['footer'](data));
    }

    return bemjson;
};
