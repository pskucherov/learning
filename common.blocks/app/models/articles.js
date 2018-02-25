module.exports = function (orm, db) {
    db.define('articles', {
        title_id: {
            type: 'text',
            defaultValue: '',
            unique: true
        },
        title: {
            type: 'text',
            defaultValue: ''
        },
        section: {
            type: 'text',
            defaultValue: ''
        },
        keywords: {
            type: 'text',
            defaultValue: ''
        },
        text: {
            type: 'text',
            defaultValue: ''
        },
        lang: {
            type: 'text',
            defaultValue: 'ru'
        },
        userId: {
            type: 'text',
            defaultValue: ''
        },
        moderate: {
            type: 'integer',
            size: 8,
            defaultValue: 0
        }
    }, {
        timestamp: true
    });
};
