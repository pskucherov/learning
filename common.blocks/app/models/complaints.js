module.exports = function (orm, db) {

    db.define('complaints', {

        tablename: {
            type: 'text',
            size: 50,
            defaultValue: ''
        },
        rowId: {
            type: 'integer',
            size: 8,
            defaultValue: 0
        },
        checkboxes: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        comment: {
            type: 'text',
            size: 1000,
            defaultValue: ''
        },
        userId: {
            type: 'text',
            size: 255,
            defaultValue: ''
        }

    }, {
        timestamp: {
            modifiedProperty: false
        }
    });

};
