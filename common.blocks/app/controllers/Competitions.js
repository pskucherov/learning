var vow = require('vow'),
    _ = require('lodash'),
    path = require('path'),
    utils = require('../utils');

/**
 * Контроллер, для работы с конкурсами
 *
 * @returns {Competitions}
 * @constructor
 */
var Competitions = function() {
    return this;
};

/**
 * Получить результаты
 *
 * @param authorModel
 * @param authorId
 */
Competitions.aggregatePosts = function(cModel) {
    return new Promise((resolve, reject) => {

        cModel.proxy('aggregate', 'vk-group-wall', [[
            { $match: { from_id: { $gte: 0 } } },
            /*{
                $group : {
                    from_id: "$userId"
                }
            }*/
            //{ $sort : { cnt: -1 } },
            //{ $limit : 3 }
        ], function (err, data) {
            if (err) {
                throw err;
                reject();
            }

            console.log(data);

            resolve(data);
        }]);

    });
};

module.exports = Competitions;
