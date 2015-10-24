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
 * Коды ответов методов.
 *
 * @type {{NEW_USER: number, OLD_USER: number}}
 */
User.ANSWER = {
    NEW_USER: 0,
    OLD_USER: 1,
    DELETED: 2
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
 *
 * @static
 */
User.createUserByVKId = function(userModel, vkid) {

    var deferred = vow.defer();

    userModel.find({ vkid: vkid }).limit(1).run(function(err, user) {

        if (err) throw err;

        if (!user.length) {
            userModel.create({ vkid: vkid }, function(err) {
                if (err) throw err;
                deferred.resolve({
                    status: User.ANSWER.NEW_USER,
                    vkid: vkid
                });
            });
        } else {
            deferred.resolve({
                status: User.ANSWER.OLD_USER,
                id: user[0].id,
                vkid: vkid
            });
        }

    });

    return deferred.promise();

};

/**
 * Удаляет запись из БД.
 *
 * @param userModel - модель таблицы user
 * @param vkid - id анкеты в vk
 * @returns {Deferred} - promise
 *
 * @static
 */
User.deleteUserByVKId = function(userModel, vkid) {

    var deferred = vow.defer();

    userModel.find({ vkid: vkid }).remove(function (err) {
        if (err) throw err;
        deferred.resolve(User.ANSWER.DELETED);
    });

    return deferred.promise();

};

module.exports = User;
