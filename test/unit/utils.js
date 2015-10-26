var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var assert = chai.assert,
    _ = require('lodash'),
    path = require('path'),
    vow = require('vow');

var appDir = './common.blocks/app/',
    models = require(path.resolve(appDir + 'models/')),
    utils = require(path.resolve(appDir + 'utils'));

models(function (err, db) {
    if (err) throw err;


    db.sync(function (err) {
        if (err) throw err;

        describe('Utils', function () {



        });

        run();

    });

});
