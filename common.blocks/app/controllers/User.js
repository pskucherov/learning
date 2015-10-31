var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils'),
    vk = require('../controllers/vk');


/**
 * Объект пользователя.
 * Для создания объекта необходим id или vkid.
 *
 * @param {Model} userModel - модель таблицы user
 * @param {Object} u - объект, с одним из элементов для создания пользователя.
 *        {Number} [u.sid]
 * @param {Function} [cb] - callback, который передаёт управление роутеру
 * @returns {User}
 * @constructor
 */
var User = function(userModel, u, cb) {
    var vkid,
        sidParse;

    this.isAuth = false;

    if (!userModel || !u || !u.sid) {
        cb && cb();
        return this;
    }

    if (u.sid) {
        sidParse = u.sid.match(/mid=([\d]+)/i) || 0;
        vkid = sidParse && parseInt(sidParse[1], 10);
    }

    if (vkid > 0) {
        User.getByVKId(userModel, vkid)
            .then(function(user) {
                !_.isEmpty(user) && _.assign(this, user[0]);
                this.isAuth = vk.isAuthOpenAPIMember(u.sid || '');
            }.bind(this))
            .always(function() {
                cb && cb();
            });
    }

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
