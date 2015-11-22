var fs = require('fs'),
    path = require('path'),
    _setting = path.resolve('./common.blocks/app/_settings.js');

if (fs.existsSync(_setting)) {
    module.exports = require(_setting);
    return;
}

// По мотивам: https://github.com/dresende/node-orm2/issues/524
// https://github.com/dresende/node-orm2/blob/master/examples/anontxt/config/settings.js
var appId = 5076733,
    settings = {
    vk: {
        appId: appId,
        appSecret: 'bEvkKDmoH9jk0pb1kE4s',
        cookieName: 'vk_app_' + appId
    },
    database   : {
        database : 'learn-demo',
        protocol : 'mysql',
        host     : '127.0.0.1',
        port     : 3306,         // optional, defaults to database default
        user     : 'root',
        password : '',
        query    : {
            pool     : true|false,   // optional, false by default
            debug    : true||false,   // optional, false by default
            strdates : true|false    // optional, false by default
        }
    }
};

module.exports = settings;
