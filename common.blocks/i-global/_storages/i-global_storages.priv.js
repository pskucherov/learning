/**
 * Получить данные из сессии
 *
 * @param {GlobalData} data
 * @param {String} name - название переменной в сессии.
 *
 * @returns {*}
 *
 */
blocks['i-global_session_get'] = function(data, name) {
    return data.session[name];
};

/**
 * Записать данные в сессию
 *
 * @param {GlobalData} data
 * @param {String} name - название переменной в сессии.
 * @param {String|Number} val - значение, которое надо записать в сессию.
 *
 */
blocks['i-global_session_set'] = function(data, name, val) {
    data.session[name] = val;
};

/**
 * Получить данные из cookie
 *
 * @param {GlobalData} data
 * @param {String} name - название переменной в cookie.
 *
 * @returns {*}
 *
 */
blocks['i-global_cookie_get'] = function(data, name) {
    return data.cookies[name];
};

/**
 * Записать данные в cookie
 *
 * @param {GlobalData} data
 * @param {String} name - название переменной в сессии.
 * @param {String|Number} val - значение, которое надо записать в сессию.
 * @param {Number} [maxAge=0] - длительность жизни куки.
 *
 */
blocks['i-global_cookie_set'] = function(data, name, val, maxAge) {
    data.res.cookie(name, val, { maxAge: maxAge || 0, httpOnly: true });
};
