qwe

var express = require('express'),
    orm = require('orm'),
    modelsPath = './models/index',
    app = express(),
    ormConnect,
    opts = {
        database : "learn-demo",
        protocol : "mysql",
        host     : "77.120.103.67",
        port     : 3306,         // optional, defaults to database default
        user     : "learn-user",
        password : "jRb5xXuj",
        query    : {
            pool     : true|false,   // optional, false by default
            debug    : true||false,   // optional, false by default
            strdates : true|false    // optional, false by default
        }
    };

ormConnect = orm.express(opts, {

    define: function(db, models) {
        db.load(modelsPath, function(err){
            if (err) {
                console.log(err);
                return;
            }
            for (var k in db.models) {
                models[k] = db.models[k];
            }
        });
    }

});

module.exports = ormConnect;
