module.exports = function (orm, db) {

    db.define('vk-group-wall', {
        post: [],
        post_id: {
            type: 'integer',
            size: 4,
            defaultValue: 0
        },
        from_id: {
            type: 'integer',
            size: 4,
            defaultValue: 0
        },
        date: {
            type: 'integer',
            size: 4,
            defaultValue: 0
        },
        commentsCount: {
            type: 'integer',
            size: 4,
            defaultValue: 0
        },
        likesCount: {
            type: 'integer',
            size: 4,
            defaultValue: 0
        },
        repostsCount: {
            type: 'integer',
            size: 4,
            defaultValue: 0
        }
    }, {
        timestamp: true
    });
};
