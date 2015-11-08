var fs = require('fs'),
    path = require('path'),
    _setting = path.resolve('./common.blocks/app/_settings.js');

if (fs.existsSync(_setting)) {
    return require(_setting);
}

// По мотивам: https://github.com/dresende/node-orm2/issues/524
// https://github.com/dresende/node-orm2/blob/master/examples/anontxt/config/settings.js
var settings = {
    vk: {
        appId: 5076733,
        appSecret: 'bEvkKDmoH9jk0pb1kE4s'
    },
    database   : {
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
    }
};

module.exports = settings;
