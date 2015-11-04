BEMPRIV.decl('vk', {
    init: function () {

        this.js({
            appId: this.data.appId || 0
        });

        this.content([
            this.data.user.isAuth ? '' : {
                elem: 'button-auth',
                appId: this.data.appId,
                redirect_uri: this._callbackUrl(),
                scope: this._getScope(),
                content: {
                    tag: 'img',
                    attrs: {
                        src: '/images/login_with_vkontakte.png'
                    }
                }
            },

            this.initOpenApi()

        ]);

    },

    /**
     * Callback урл для серверной авторизации во вконтакте.
     *
     * @returns {string}
     * @private
     */
    _callbackUrl: function() {
        return this.data.req.protocol + '://' + this.data.req.headers.host + '/verify'
    },

    /**
     * Запрашиваемые доступы при авторизации (https://vk.com/dev/permissions)
     *
     * @returns {string}
     * @private
     */
    _getScope: function() {
        return [
            'friends',
            'photos',
            'video',
            'email',
            'notifications',
            'offline'
        ].join(',');
    },

    initOpenApi: function() {
        return [
            {
                attrs: {
                    id: 'vk_api_transport'
                }
            }
        ];
    },

    getContent: function() {
        return '';
    }

});

/*
BEMPRIV.decl({ block: 'vk-button', baseBlock: 'vk' }, {
    getContent: function() {
        return {
            tag: 'img',
            attrs: {
                src: '/images/login_with_vkontakte.png'
            }
        };
    }
});

BEMPRIV.decl({ block: 'vk-button-start', baseBlock: 'vk' }, {
    getContent: function() {
        return 'Начать';
    }
});
*/
