module.exports = function (orm, db) {

    var s = db.define('subjects', {
            id: {
                type: 'serial',
                key: true
            },
            name: {
                type: 'text',
                size: 255,
                defaultValue: ''
            }
        }),
        b = db.define('brain-tests', {

            id: {
                type: 'serial',
                key: true
            },

            class: {
                type: 'integer',
                size: 2,
                index: true
            },

            name: {
                type: 'text',
                size: 255,
                defaultValue: ''
            },

            descr: {
                type: 'text',
                defaultValue: ''
            },

            question: {
                type: 'text',
                defaultValue: ''
            },

            answers: {
                type: 'text',
                defaultValue: ''
            },

            rightanswernum: {
                type: 'integer',
                size: 2
            }
        });

    db.define('brain-tests-answers', {
        id: {
            type: 'serial',
            key: true
        },

        userId: {
            type: 'integer',
            size: 4,
            index: true
        },

        questionId: {
            type: 'integer',
            size: 4
        },

        answer: {
            type: 'boolean'
        }

    }, {
        timestamp: {
            modifiedProperty: false
        }
    });

    b.hasOne('subj', s, { reverse: 'test', autoFetch: true });

};
