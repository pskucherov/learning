module.exports = function (orm, db) {

    var s = db.define('poems', {
            id: {
                type: 'serial',
                key: true
            },
            name: {
                type: 'text',
                size: 50,
                defaultValue: ''
            },
            author: {
                type: 'text',
                size: 255,
                defaultValue: ''
            },
            class: {
                type: 'integer',
                size: 2,
                defaultValue: 0,
                index: true
            },
            userId: {
                type: 'integer',
                size: 8,
                defaultValue: 0
            }
        }, {
            timestamp: {
                modifiedProperty: false
            }
        }),
        b = db.define('poem-text', {
            id: {
                type: 'serial',
                key: true
            },
            line_num: {
                type: 'integer',
                size: 4,
                defaultValue: 0
            },
            line: {
                type: 'text',
                size: 255,
                defaultValue: ''
            },
            'fts-tokens': {
                type: 'text',
                size: 4000,
                defaultValue: ''
            },
            nextEmpLine: {
                type: 'boolean',
                defaultValue: false
            },
            imageUrl: {
                type: 'text',
                size: 255,
                defaultValue: ''
            }
        });

    b.hasOne('poem', s, { reverse: 'poem', autoFetch: true });

};
