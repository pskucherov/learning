var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils');

/**
 * Контроллер, для работы с авторами
 *
 * @returns {Subjects}
 * @constructor
 */
var Subjects = function() {
    return this;
};

/**
 * Добавить автора
 *
 * @param aModel
 * @param id
 * @returns {*}
 */
Subjects.get = function(sModel, id) {
    var deferred = vow.defer();

    sModel.find({ _id: id }, function (err, subject) {
        if (err) throw err;
        deferred.resolve(_.get(subject, '0', []));
    });

    return deferred.promise();
};

module.exports = Subjects;
