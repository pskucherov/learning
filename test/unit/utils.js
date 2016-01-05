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

        describe('Utils', function() {

            describe('formatEmptyLines', function() {

                it('should return string', function() {
                    var text = utils.formatEmptyLines('a\nb\nc');
                    return assert.isString(text, 'wrong type');
                });

                it('should return string[]', function() {
                    var text = utils.formatEmptyLines(['a', 'b', 'c']);
                    return assert.isArray(text, 'wrong type');
                });

                it('should join two empty lines in one (for String)', function() {
                    var text = utils.formatEmptyLines('a\n\nb\n\n\n\n\nc\nd\n');
                    return assert.equal(text, 'a\n\nb\n\nc\nd');
                });

                it('should join two empty lines in one (for Array)', function() {
                    var text = utils.formatEmptyLines(['', '', 'a', '', 'b', '', '', '', 'c', 'd', '']);
                    return assert.deepEqual(text, ['a', '', 'b', '', 'c', 'd']);
                });

            });

            describe('addStringInTextAfterComma', function() {
                it('should return same string', function() {
                    var text = utils.addStringInTextAfterComma('', 'a');
                    return assert.equal(text, 'a');
                });
                it('should not inset string in text', function() {
                    var text = utils.addStringInTextAfterComma('b,a', 'a');
                    return assert.equal(text, 'b,a');
                });
                it('should return text joined by comma', function() {
                    var text = utils.addStringInTextAfterComma('a,b,c', 'd');
                    return assert.equal(text, 'a,b,c,d');
                });
            });

        });

        run();

    });

});
