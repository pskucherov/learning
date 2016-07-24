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
            cookieName: 'vk_app_' + appId,
            groupId: 83561592
        },
        database: 'mongodb://localhost:27017/learn-demo'
    };

module.exports = settings;
