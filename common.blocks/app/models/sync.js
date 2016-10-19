var path = require('path'),
    models = require(path.resolve('./common.blocks/app/models/index')),
    _ = require('lodash'),
    BM25 = require('fts-js'),
    utils = require('../utils');

models(function (err, db) {
    if (err) throw err;

    let promises = [];

    db.sync(function (err) {
        if (err) throw err;

        db.models['speaker-learn-poem'].find().run((err, p) => {
            p.forEach((poem) => {
                if (!poem.poemId || !poem.poemId.length) {
                    return;
                }

                db.models['poems'].find({ _id: utils.oId(poem.poemId) }).count((err, count) => {
                    if (!count) {
                        db.models['speaker-learn-poem'].find({ poemId: utils.oId(poem.poemId) }).remove();
                    }
                });
            });
        })
    });

});
