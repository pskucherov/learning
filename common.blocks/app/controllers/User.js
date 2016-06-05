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
 * Отправляет данные об рейтинге на клиент
 *
 * @param ratingModel
 * @param io
 * @returns {User}
 */
User.prototype.calcRating = function(ratingModel, io) {
    ratingModel.count({ userId: utils.oId(this._id), answer: true }, function (err, rightAnswers) {
        ratingModel.count({ userId: utils.oId(this._id) }, function (err, answers) {
            io.emit('user:rating', {
                countAnswers: answers,
                rightAnswers: rightAnswers
            });
        });
    });

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
                _id: utils.oId(user[0]._id),
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
 * @param {Number|Array} vkid - id анкеты в vk
 * @returns {Deferred} - promise
 *
 * @static
 */
User.deleteByVKId = function(userModel, vkid) {

    var deferred = vow.defer();

    userModel.find({ vkid: vkid }).remove(function(err) {
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
            if (!_.isUndefined(user[0][key]) && key !== '_id' && key !== 'vkid') {
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
 * @param {Number|Array} vkid - id анкеты в vk
 * @returns {Deferred} - promise
 *
 * @static
 */
User.getByVKId = function(userModel, vkid) {
    var deferred = vow.defer();

    userModel.find({ vkid: vkid }).run(function(err, user) {
        if (err) throw err;

        if (_.isEmpty(user)) {
            deferred.reject(user);
        } else {
            deferred.resolve(user);
        }
    });

    return deferred.promise();
};

/**
 * Получить данные пользователя, по id
 *
 * @param {Model} userModel - модель таблицы user
 * @param {Number|Array} id - id анкеты
 * @param {String[]} fields - какие значения надо вернуть
 * @returns {Deferred} - promise
 *
 * @static
 */
User.getById = function(userModel, id, fields) {
    var deferred = vow.defer();

    // TODO: переписать на выборку нужных полей из БД
    fields = utils.parseUserFields(fields);

    userModel.find({ _id: { $in: utils.oId(id) } }).run(function(err, user) {
        if (err) throw err;

        if (_.isEmpty(user)) {
            deferred.reject([]);
        } else {
            deferred.resolve(user.map(function(u) { return _.pick(u, fields); }));
        }
    });

    return deferred.promise();
};

/**
 * Возвращает количество баллов в одном процентре,
 * для рассчёта рейтинга пользователей
 *
 * @param db
 * @param {Number|String|Query} [userIds] - id пользователей, для которых надо сделать выборку, если параметр не зада - выбирается для всех.
 * @returns {*}
 */
/*
User.getPointInOneProcent = function(db, ids) {
    var deferred = vow.defer(),
        whereId = ids ? 'userId IN (' + ids + ') AND' : '';

    db.driver.execQuery('SELECT MAX(t2.c) AS m FROM ' +
        '(SELECT COUNT(*) AS c FROM `brain-tests-answers` AS t1 WHERE ' + whereId + ' answer=1 GROUP BY userid) AS t2',
        function(err, data) {

        if (err) throw err;

        if (_.isEmpty(data)) {
            deferred.reject(data);
        } else {
            deferred.resolve(data[0].m / 100);
        }
    });

    return deferred.promise();
};
*/

module.exports = User;
