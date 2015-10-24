var vow = require('vow');

/**
 * Объект пользователя
 *
 * @returns {User}
 * @constructor
 */
var User = function() {
    this.id = 0;
    return this;
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
 * @param userModel - модель таблицы user
 * @param vkid - id анкеты в vk
 * @returns {Deferred} - promise
 */
User.prototype.createUserById = function(userModel, vkid) {

    var deferred = vow.defer();

    userModel.find({ vkid: vkid }, function(err, user) {

        if (err) {
            defer.reject(err);
            return;
        }

        if (!user.length) {
            userModel.create({ vkid: vkid }, function(err) {

                if (err) {
                    defer.reject(err);
                    return;
                }

                deferred.resolve(vkid);

            });
        } else {
            deferred.resolve(vkid);
        }

    });

    return deferred.promise();

};

module.exports = new User();
