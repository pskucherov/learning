module.exports = function (orm, db) {

    db.define("users", {

        id: { type: 'serial', key: true },
        vkid: { type: 'integer', unique: true, size: 8, defaultValue: 0 },
        first_name: { type: 'text', defaultValue: '', size: 50 },
        last_name: { type: 'text', defaultValue: '', size: 50 }

    });

};
