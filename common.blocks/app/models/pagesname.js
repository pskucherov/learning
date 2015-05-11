module.exports = function (db, cb) {

    db.define("pagesname", {

        id: {type: 'serial', key: true }, // the auto-incrementing primary key
        md5cript: {type: 'text' },
        hosturl: {type: 'text' },
        url: {type: 'text' }

    });

    return cb();

};
