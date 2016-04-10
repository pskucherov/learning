module.exports = function (orm, db) {

    var s = db.define('subjects', {
            name: {
                type: 'text',
                size: 255,
                defaultValue: ''
            }
        }),
        b = db.define('brain-tests', {
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
            },

            complaints: {
                type: 'integer',
                size: 2,
                defaultValue: 0
            },

            subj_id: {
                type: 'text',
                defaultValue: ''
            }
        });

    db.define('brain-tests-answers', {
        userId: {
            type: 'text',
            size: 255,
            defaultValue: '',
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
};
