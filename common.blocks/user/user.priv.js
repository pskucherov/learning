BEMPRIV.decl('user', {

    init: function() {
        var user = this.data.user || {};

        this.mods({
            pos: 'header-right'
        });

        this.content([
                user.isAuth && this._getInfo(user) || BEMPRIV.create('vk', this.data).json()
        ]);

    },

    _getInfo: function(user) {
        return {
            elem: 'info',
            first_name: user.first_name,
            second_name: user.second_name,
            photo_50: user.photo_50
        }
    }

}, {
    // static
});
