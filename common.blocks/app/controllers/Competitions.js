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
            {
                $group : {
                    _id: { from_id: "$from_id" },
                    totalLikes: { $sum: "$likesCount" },
                    totalComments: { $sum: "$commentsCount" },
                    totalReposts: { $sum: "$repostsCount" }
                }
            },
            { $sort: { totalReposts: -1 } },
            { $limit: 100 }
        ], function (err, data) {
            if (err) {
                throw err;
                reject();
            }

            resolve(data);
        }]);

    });
};

module.exports = Competitions;
