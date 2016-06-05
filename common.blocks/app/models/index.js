// По мотивам: https://github.com/dresende/node-orm2/issues/524
// https://github.com/dresende/node-orm2/blob/master/examples/anontxt/app/models/index.js

var models = [
        'users',
        'subjects',
        'complaints',
        'poems'
    ];

var orm = require('orm'),
    modts = require('orm-timestamps'),
    path = require('path'),
    settings = require(path.resolve('./common.blocks/app/settings'));

var connection = null;

function setup(db, cb) {

    for (var i in models) {
        require('./' + models[i])(orm, db);
    }

    return cb(null, db);
}

module.exports = function (cb) {
    if (connection) return cb(null, connection);

    orm.connect(settings.database, function (err, db) {
        if (err) return cb(err);
        
        db.use(modts, {
            createdProperty: 'created_at',
            modifiedProperty: 'modified_at',
            expireProperty: false,
            dbtype: { type: 'date', time: true },
            now: function() { return new Date(); },
            expire: function() { var d = new Date(); return d.setMinutes(d.getMinutes() + 60); },
            persist: true
        });

        connection = db;
        db.settings.set('instance.returnAllErrors', true);

        db.settings.set('connection.debug', true);
        db.settings.set('connection.pool', true);

        setup(db, cb);
    });
};
