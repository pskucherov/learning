var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);

var assert = chai.assert,
    _ = require('lodash'),
    path = require('path'),
    vow = require('vow');

var appDir = './common.blocks/app/',
    models = require(path.resolve(appDir + 'models/')),
    Consultor = require(path.resolve(appDir + 'controllers/Consultor'));
    User = require(path.resolve(appDir + 'controllers/User'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        var VK_USER_ID = 100,
            usersModel = db.models['users'],
            consultorModel = db.models['s-consultor'];

        describe('Controller: Consultor', function () {

            before(function (done) {
                this.timeout(10000);
                User.deleteByVKId(usersModel, VK_USER_ID).then(function () {
                    done();
                });
            });
            beforeEach(function (done) {
                this.timeout(10000);
                consultorModel.find().remove(function () {
                    done();
                });
            });

            describe('Create consultor', function () {
                it('should create consultor', function () {
                    var defered = vow.defer(),
                        question = 'Test question one',
                        userId = 'a12345678901';

                    Consultor.create(consultorModel, question, userId)
                        .then(function (data) {
                            defered.resolve(data);
                        });

                        return assert.isFulfilled(
                            defered.promise(),
                            'Should be resolved'
                        );
                });

                it('should get all questions', function () {
                    var defered = vow.defer(),
                        question = 'Test question two';

                    User.createByVKId(usersModel, VK_USER_ID)
                        .then(function () {
                            User.getByVKId(usersModel, VK_USER_ID)
                                .then(function (data) {
                                    defered.resolve(data);
                                    Consultor.create(consultorModel, question, data[0]._id)
                                        .then(function () {
                                            Consultor.getAllQuestions(db)
                                                .then(function(questions) {
                                                    defered.resolve(questions.length);
                                                });
                                        });
                                });
                        });

                    return assert.eventually.lengthOf(
                        defered.promise(),
                        1,
                        'Should be equal 1'
                    );
                });

                it('should find consultor by id', function () {
                    var defered = vow.defer(),
                        question = 'Test question three',
                        userId = 'a12345678901';

                    Consultor.create(consultorModel, question, userId)
                        .then(function (data) {
                            Consultor.getById(consultorModel, data._id)
                                .then(function (question) {
                                    defered.resolve(!_.isEmpty(question));
                                });
                        });

                    return assert.eventually.ok(
                        defered.promise(),
                        'Should be not empty'
                    );
                });
            });
        });
        run();
    });
});