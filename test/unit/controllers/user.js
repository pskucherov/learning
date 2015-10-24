var assert = require('assert'),
    _ = require('lodash'),
    path = require('path'),
    express = require('express'),
    app = express();

var appDir = './common.blocks/app/',
    ormConnect = require(path.resolve(appDir + 'ormConnect')),
    user = require(path.resolve(appDir + 'controllers/user'));

app.use(ormConnect);

describe('Controller: user', function() {
  describe('#createUserById(userModel, vkid)', function () {
    it('should find user in BD with vkid = 666', function () {

        for (var i in ormConnect) console.log(i);

    });
  });
});
