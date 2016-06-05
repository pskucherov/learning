var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils');

/**
 * Контроллер, для работы с тестами
 *
 * @returns {BrainTests}
 * @constructor
 */
var Complaints = function() {
    return this;
};

/**
 * Создаёт жалобу в таблице
 *
 * @param CModel
 * @param tablename
 * @param rowId
 * @param checkboxes
 * @param comment
 * @param userId
 * @returns {*}
 */
Complaints.createComplaint = function(CModel, tablename, rowId, checkboxes, comment, userId) {
    var deferred = vow.defer();

    CModel.create({
        tablename: tablename,
        rowId: utils.oId(rowId),
        checkboxes: checkboxes,
        comment: comment,
        userId: utils.oId(userId)
    }, function (err) {
        if (err) throw err;

        deferred.resolve();
    });

    return deferred.promise();
};

module.exports = Complaints;
