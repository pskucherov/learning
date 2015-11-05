module.exports = function (orm, db) {

    var s = db.define('subjects', {

        id: {
            type: 'serial',
            key: true
        },
        name: {
            type: 'text',
            unique: true,
            size: 255,
            defaultValue: ''
        }

    });

    db.sync(function(err) {
        if (err) throw err;

        s.create([
            { name: 'Английский язык' },
            { name: 'Биология' },
            { name: 'География' },
            { name: 'ИЗО' },
            { name: 'Информатика' },
            { name: 'История' },
            { name: 'Литература' },
            { name: 'Математика' },
            { name: 'Музыка' },
            { name: 'Немецкий язык' },
            { name: 'ОБЖ' },
            { name: 'Обществознание' },
            { name: 'Окружающий мир' },
            { name: 'ОРКСЭ' },
            { name: 'Русский язык' },
            { name: 'Технология' },
            { name: 'Физика' },
            { name: 'Физкультура' },
            { name: 'Химия' }
        ], function(err) {});

    });

};
