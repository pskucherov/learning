BEMPRIV.decl('vk', {
    init: function () {

        this.mods({
            pos: 'header-right'
        });

        this.content([
            /*{
                block: 'link',
                url: 'https://oauth.vk.com/authorize?client_id=' + this.params.appId + '&display=page&redirect_uri=http://localhost:3000/verify&scope=friends,email&response_type=code&v=5.37',
                content: {
                    tag: 'img',
                    attrs: {
                        src: '/images/login_with_vkontakte.png'
                    }
                }
            },*/

            {
                elem: 'button-auth',
                appId: this.params.appId,
                redirect_uri: this._callbackUrl(),
                scope: this._getScope()
            }

            /*
            {
                attrs: {
                    id: 'vk_api_transport'
                }
            },
            this._initOpenApi()
            */
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

    _initOpenApi: function() {
        return {
            block: 'page',
            elem: 'js',
            content: '' +
                /*'window.vkAsyncInit = function() {' +
                'VK.init({' +
                'apiId: ' + this.params.appId +
                '});' +

                '};' +*/
                'setTimeout(function() {' +
                'var el = document.createElement("script");' +
                'el.type = "text/javascript";' +
                'el.src = "//vk.com/js/api/openapi.js";' +
                'el.async = true;' +
                'document.getElementById("vk_api_transport").appendChild(el);' +
                '}, 0);'
        };
    },

    getDefaultParams: function() {
        return {
            appId: 5076733
        };
    }

});
