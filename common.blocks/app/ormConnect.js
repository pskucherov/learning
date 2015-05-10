var express = require('express'),
    orm = require('orm'),
    app = express(),
    ormConnect,
    opts = {
        database : "dbname",
        protocol : "mysql",
        host     : "127.0.0.1",
        port     : 3306,         // optional, defaults to database default
        user     : "..",
        password : "..",
        query    : {
            pool     : true|false,   // optional, false by default
            debug    : true||false,   // optional, false by default
            strdates : true|false    // optional, false by default
        }
    };

ormConnect = orm.express(opts);

module.exports = ormConnect;
