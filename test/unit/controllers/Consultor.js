var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised'),
    assert = chai.assert,
    path = require('path');

chai.use(chaiAsPromised);

var appDir = path.resolve(__dirname, '../../../common.blocks/app'),
    models = require(path.join(appDir, 'models')),
    Consultor = require(path.join(appDir, 'controllers/Consultor'));

describe('Controller: Consultor', function () {

    var consultorModel;

    before(function() {
        return new Promise((resolve, reject) => {
            models(function (err, db) {
                if (err) throw reject(err);

                db.sync(function (err) {
                    if (err) throw reject(err);
                    resolve(db.models['s-consultor']);
                });

            });
        }).then((model) => consultorModel = model);
    });

    beforeEach(function() {
        return new Promise((resolve, reject) => {
            consultorModel.find().remove(function(err) {
                if (err) {
                    reject(err);
                }
                resolve();
            });
        });
    });

    describe('create', function() {
        it('should create question', function () {
            var question = 'What\'s up?',
                userId = 'a12345678901';

            return Consultor
                .create(consultorModel, question, userId)
                .then((data) => assert.equal(data.question, question));
        });
    });
});
