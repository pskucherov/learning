BEMPRIV.decl('user', {

    init: function() {
        var user = this.data.user || {};

        this.js(true);

        this.mods({
            pos: 'header-right'
        });

        this.content([
            user.isAuth && this._getInfo(user) || ''
            //BEMPRIV.create('vk', this.data).json()
            //BEMPRIV.create('vk-button', this.data).json()
        ]);

    },

    _getInfo: function(user) {
        return {
            elem: 'info',
            first_name: user.first_name,
            last_name: user.last_name,
            photo_50: user.photo_50,
            photo_100: user.photo_100
        }
    }

}, {
    // static
});
