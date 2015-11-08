var path = require('path'),
    models = require(path.resolve('./common.blocks/app/models/index')),
    _ = require('lodash');


models(function (err, db) {

    db.sync(function (err) {
        if (err) throw err;

        db.models.subjects.find({id: 1}).limit(1).run(function (err, subj) {

            if (_.isEmpty(subj)) {

                db.models.subjects.create([
                    {name: 'Английский язык'},
                    {name: 'Биология'},
                    {name: 'География'},
                    {name: 'ИЗО'},
                    {name: 'Информатика'},
                    {name: 'История'},
                    {name: 'Литература'},
                    {name: 'Математика'},
                    {name: 'Музыка'},
                    {name: 'Немецкий язык'},
                    {name: 'ОБЖ'},
                    {name: 'Обществознание'},
                    {name: 'Окружающий мир'},
                    {name: 'ОРКСЭ'},
                    {name: 'Русский язык'},
                    {name: 'Технология'},
                    {name: 'Физика'},
                    {name: 'Физкультура'},
                    {name: 'Химия'}
                ], function (err) {
                });

            }

        });


    });

});
