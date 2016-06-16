module.exports = function (orm, db) {

    // 0 - модератор ещё не смотрел, 1 - всё ок, 2 - отклонено
    var MODERATE_ENUM = ['0', '1', '2'];

    db.define('consultor', {
        question: {
            type: 'text',
            size: 2048,
            defaultValue: ''
        },
        userId: {
            type: 'text',
            size: 255,
            defaultValue: ''
        },
        moderate: {
            type: 'enum',
            values: MODERATE_ENUM,
            defaultValue: MODERATE_ENUM[0]
        }
    }, {
        timestamp: true
    });
};
