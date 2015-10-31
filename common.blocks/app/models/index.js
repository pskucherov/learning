// По мотивам: https://github.com/dresende/node-orm2/issues/524
// https://github.com/dresende/node-orm2/blob/master/examples/anontxt/app/models/index.js

var models = [
        'users',
        'pagesname'
    ];

var orm = require('orm'),
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

        connection = db;
        db.settings.set('instance.returnAllErrors', true);
        setup(db, cb);
    });
};
