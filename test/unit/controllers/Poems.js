var chai = require('chai'),
    chaiAsPromised = require('chai-as-promised');

chai.use(chaiAsPromised);
let assert = chai.assert,
    _ = require('lodash'),
    path = require('path'),
    express = require('express'),
    app = express(),
    vow = require('vow');

let appDir = './common.blocks/app/',
    models = require(path.resolve(appDir + 'models/')),
    Poems = require(path.resolve(appDir + 'controllers/Poems')),
    Authors = require(path.resolve(appDir + 'controllers/Authors'));

models(function (err, db) {
    if (err) throw err;

    db.sync(function (err) {
        if (err) throw err;

        let pModel = db.models['poems'],
            aModel = db.models['authors'];

        describe('Controller: Poems', function () {

            beforeEach(function (done) {
                this.timeout(10000);
                pModel.find().remove(function() {
                    aModel.find().remove(function() {
                        done();
                    });
                });
            });

            describe('CRUD Poems', function () {

                it('should create Poems', function () {

                    var deferred = vow.defer();

                    Poems.create(pModel, 'name', 1, 'a12345678901', 'текст стихотворения\n<Br>состоящий из нескольких строк ;":№%')
                        .then(function (data) {
                            deferred.resolve(data);
                        });

                    return assert.isFulfilled(
                        deferred.promise(),
                        'Should be resolved'
                    );

                });

                it('should create two line text in poem', function () {

                    let deferred = vow.defer(),
                        uId = 'b12345678902';

                    Authors.create(aModel, 'a12345678901', uId).then(a => {
                        Poems.create(pModel, 'name', a._id, uId, 'текст стихотворения\n<Br>состоящий из нескольких строк ;":№%')
                            .then(function (data) {
                                Poems.getPoemByNameAndAuthor(pModel, db.models['authors'], 'name', a.name, uId)
                                    .then(function (poem) {
                                        deferred.resolve(poem.poem.length);
                                    });
                            });
                    });

                    return assert.eventually.equal(
                        deferred.promise(),
                        2,
                        'Shouild be equal 2'
                    );

                });

                it('should find poem by _id', function () {
                    
                    var deferred = vow.defer(),
                        userId = 'b12345678902';

                    Authors.create(aModel, 'a12345678901', userId).then(a => {
                        Poems.create(pModel, 'name', a._id, userId, 'текст стихотворения\n<Br>состоящий из нескольких строк ;":№%')
                        .then(function (data) {
                            Poems.getById(pModel, db.models['authors'], data._id)
                                .then(function (poem) {
                                    deferred.resolve(poem.poem.length);
                                });
                        });
                });

                    return assert.eventually.ok(
                        deferred.promise(),
                        'Should be not empty'
                    );

                });

            });

        });

        run();

    });

});
