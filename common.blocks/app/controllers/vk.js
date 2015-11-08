var params = require('../settings').vk,
    VK = require('vksdk'),
    vk = new VK({
        appId: params.appId,
        appSecret: params.appSecret,
        language: 'ru',
        https: true
    });

module.exports = vk;
