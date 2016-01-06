module.exports = function (orm, db) {

    // 0 - модератор ещё не смотрел, 1 - всё ок, 2 - отклонено
    var MODERATE_ENUM = ['0', '1', '2'];

    var s = db.define('poems', {
            id: {
                type: 'serial',
                key: true
            },
            name: {
                type: 'text',
                size: 50,
                index: true,
                defaultValue: ''
            },
            class: {
                type: 'integer',
                size: 2,
                defaultValue: 0,
                index: true
            },
            userId: {
                type: 'integer',
                size: 8,
                defaultValue: 0
            },
            moderate: {
                type: 'enum',
                values: MODERATE_ENUM,
                defaultValue: MODERATE_ENUM[0]
            }
        }, {
            timestamp: {
                modifiedProperty: false
            }
        }),
        b = db.define('poem-text', {
            id: {
                type: 'serial',
                key: true
            },
            line_num: {
                type: 'integer',
                size: 4,
                defaultValue: 0
            },
            line: {
                type: 'text',
                size: 255,
                defaultValue: ''
            },
            'fts-tokens': {
                type: 'text',
                size: 4000,
                defaultValue: ''
            },
            nextEmpLine: {
                type: 'boolean',
                defaultValue: false
            },
            imageUrl: {
                type: 'text',
                size: 255,
                defaultValue: ''
            }
        }, {
            timestamp: false
        }),
        a = db.define('authors', {
            id: {
                type: 'serial',
                key: true
            },
            name: {
                type: 'text',
                size: 255,
                index: true,
                defaultValue: ''
            },
            userId: {
                type: 'integer',
                size: 8,
                defaultValue: 0
            },
            moderate: {
                type: 'enum',
                values: MODERATE_ENUM,
                defaultValue: MODERATE_ENUM[0]
            }
        }, {
            timestamp: false
        }),
        selectPoem = db.define('speaker-learn-poem', {
            id: {
                type: 'serial',
                key: true
            },
            userId: {
                type: 'integer',
                size: 8,
                index: true
            },
            // Эакончил учить стих или ещё в процессе
            finished: {
                type: 'boolean',
                defaultValue: false
            },
            // Время, потраченное на изучение стиха
            deltaTime: {
                type: 'integer',
                size: 8,
                defaultValue: 0
            },
            // Какие шаги завершены
            complitedSteps: {
                type: 'text',
                size: 1000,
                defaultValue: ''
            },
            // попыток
            attempts: {
                type: 'integer',
                size: 4,
                defaultValue: 0
            }
        }, {
            timestamp: true
        });

    // TODO: убрать autoFetch

    s.hasOne('author', a, { reverse: 'author', autoFetch: true });

    b.hasOne('poem', s, { reverse: 'poem', autoFetch: true });

    selectPoem.hasOne('poem', s);
};
