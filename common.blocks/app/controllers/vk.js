var params = require('../settings').vk,
    VK = require('vksdk'),
    vk = new VK({
        appId: params.appId,
        appSecret: 'bEvkKDmoH9jk0pb1kE4s',
        language: 'ru',
        https: true
    });



module.exports = vk;
