BEMPRIV.decl({ block: 'vk', modName: 'link', modVal: 'auth' }, {
    init: function () {

        console.log('priv.js');

        this.content({
            block: 'vk',
            elem: 'q',
            mods: { link: 'auth' },
            appId: this.data.appId,
            redirect_uri: this._callbackUrl(),
            scope: this._getScope()
        });
    }
});
