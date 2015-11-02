BEMPRIV.decl({ block: 'vk', modName: 'link', modVal: 'auth' }, {
    init: function () {
        this.content({
            appId: this.data.appId,
            redirect_uri: this._callbackUrl(),
            scope: this._getScope()
        });
    }
});
