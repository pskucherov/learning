module.exports = function (orm, db) {

    db.define("users", {

        id: {
            type: 'serial',
            key: true
        },
        vkid: {
            type: 'integer',
            unique: true,
            size: 8,
            defaultValue: 0
        },
        first_name: {
            type: 'text',
            size: 50,
            defaultValue: ''
        },
        last_name: {
            type: 'text',
            size: 50,
            defaultValue: ''
        },
        sex: {
            type: 'integer',
            size: 2,
            defaultValue: 0
        },
        class: {
            type: 'integer',
            size: 2,
            defaultValue: 1
        },
        email: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        photo_50: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        photo_100: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        photo_200_orig: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        photo_200: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        has_mobile: {
            type: 'boolean',
            defaultValue: 0
        },
        lastvisit: {
            type: 'integer',
            size: 8,
            defaultValue: 0
        },
        access_token: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        brain_test_answers: []

    }, {
        timestamp: true
    });

};
