module.exports = function (orm, db) {

    db.define("users", {

        id: { type: 'serial', key: true }, // the auto-incrementing primary key
        vkid: Number,
        firstname: { type: 'text', defaultValue: '' },
        lastname: { type: 'text', defaultValue: '' }

    });

};
