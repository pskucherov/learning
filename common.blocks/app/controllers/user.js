var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils'),
    crypto = require('crypto');

/**
 * Объект пользователя.
 * Для создания объекта необходим id или vkid.
 *
 * @param {Number} [id]
 * @param {Number} [vkid]
 * @returns {User}
 * @constructor
 */
var User = function(id, vkid) {

    if (!id && !vkid) throw 'Нельзя создать объект пользователя без id';

    this.id = 0;
    return this;
};

/**
 * Коды ответов методов.
 *
 * @type {{NEW_USER: number, OLD_USER: number}}
 */
User.ANSWER = {
    NEW_USER: 0, // Создан новый пользователь
    OLD_USER: 1, // Найден старый пользователь и нового создавать не пришлось
    DELETED: 2, // Пользователь удалён
    FIELDS_UPDATED: 3 // Поля данных в записи пользователя успешно изменены
};

/**
 * Установить id пользователя
 * @param id
 * @returns {User}
 */
User.prototype.setId = function(id) {
    this.id = id;
    return this;
};

/**
 * Сверяет сессию пользователя с закодированной версией и определяет авторизован ли пользователь.
 *
 * @param {String} sessionData
 * @returns {Boolean}
 * @static private
 */
User._authOpenAPIMember = function(sessionData) {

    var session = {},
        isAuth = false,
        valid_keys = ['expire', 'mid', 'secret', 'sid', 'sig'],
        sign = '',
        seessionItems;

    if (sessionData) {

        seessionItems = sessionData.split('&');

        _.forEach(seessionItems, function(item) {
            var key,
                val;

            item = item.split('=');

            key = item[0];
            val = item[1];
            
            if (_.isEmpty(key) || _.isEmpty(val) || valid_keys.indexOf(key) === -1) {
                return;
            }

            session[key] = val;
        });

        if (!_.every(valid_keys, function(key) { return !_.isUndefined(session[key]); })) {
            return isAuth;
        }

        _.forEach(valid_keys, function (val) {
             if (val !== 'sig') {
                 sign += val + '=' + session[val];
             }
        });

        // TODO: вынести APP_SHARED_SECRET в общее место
        sign += 'bEvkKDmoH9jk0pb1kE4s';

        sign = crypto.createHash('md5').update(sign).digest('hex');

        console.log('\n\n\n start');
        console.log(sign);
        console.log(session['sig']);
        console.log(session['sig'] === sign);
        console.log(session['sig'].length);
        console.log(sign.length);

        if (session['sig'] === sign) { //} && session['expire'] > Math.floor(Date.now() / 1000)) {
            isAuth = true;
        }

    }

    return isAuth;
};



/**
 * Проверяет авторизован ли пользователь.
 *
 * @returns {Boolean}
 */
User.prototype.isAuthorized = function() {
    return this.id !== 0;
};

/**
 * Идентификация пользователя по коду,
 * хранящемуся в кукисах.
 *
 * @param code
 * @returns {User}
 */
User.prototype.authentication = function(code) {
    /* здесь будет проверка авторизации по БД */
    return this;
};

/**
 * Создаёт запись в БД, если такого пользователя нет.
 * Если есть, то ничего не делает.
 *
 * @param {Model} userModel - модель таблицы user
 * @param {Number} vkid - id анкеты в vk
 * @returns {Deferred} - promise
 *
 * @static
 */
User.createByVKId = function(userModel, vkid) {

    var deferred = vow.defer();

    User.getByVKId(userModel, vkid).then(
        // resolve
        function(user) {
            deferred.resolve({
                status: User.ANSWER.OLD_USER,
                id: user[0].id,
                vkid: vkid
            });
        },

        // reject
        function() {
            userModel.create({ vkid: vkid }, function (err) {
                if (err) throw err;
                deferred.resolve({
                    status: User.ANSWER.NEW_USER,
                    vkid: vkid
                });
            });
        }
    );

    return deferred.promise();

};

/**
 * Удаляет запись из БД.
 *
 * @param {Model} userModel - модель таблицы user
 * @param {Number} vkid - id анкеты в vk
 * @returns {Deferred} - promise
 *
 * @static
 */
User.deleteByVKId = function(userModel, vkid) {

    var deferred = vow.defer();

    userModel.find({ vkid: vkid }).remove(function (err) {
        if (err) throw err;
        deferred.resolve(User.ANSWER.DELETED);
    });

    return deferred.promise();

};

/**
 * Обновить данные пользователя, если они изменились
 *
 * @param {Model} userModel - модель таблицы user
 * @param {Number} vkid - id анкеты в vk
 * @param {Object} fields - поля модели user
 * @returns {Deferred} - promise
 *
 * @static
 */
User.updateFieldsByVKId = function(userModel, vkid, fields) {

    var deferred = vow.defer();

    User.getByVKId(userModel, vkid).then(function(user) {

        _.forEach(fields, function(value, key) {
            // Если такое поле существует в моделе — сохраняем его.
            // Удаляем уникальные поля, т.к. их нелья редактировать.
            if (!_.isUndefined(user[0][key]) && key !== 'id' && key !== 'vkid') {
                user[0][key] = fields[key];
            }
        });

        user[0].save(function (err) {
            if (err) throw err;
            deferred.resolve(User.ANSWER.FIELDS_UPDATED);
        });

    }, function(err) { deferred.reject(err); });

    return deferred.promise();

};

/**
 * Получить данные пользователя, по вк id
 *
 * @param {Model} userModel - модель таблицы user
 * @param {Number} vkid - id анкеты в vk
 * @returns {Deferred} - promise
 *
 * @static
 */
User.getByVKId = function(userModel, vkid) {
    var deferred = vow.defer();

    userModel.find({ vkid: vkid }).limit(1).run(function(err, user) {
        if (err) throw err;

        if (_.isEmpty(user)) {
            deferred.reject(user);
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise();
};

module.exports = User;
