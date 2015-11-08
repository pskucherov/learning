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

    b.hasOne('subj', s, { reverse:  'test' });

};
