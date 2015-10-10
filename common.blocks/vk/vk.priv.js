BEMPRIV.decl('vk', {
        init: function () {

            this.content([
                {
                    block: 'link',
                    url: 'https://oauth.vk.com/authorize?client_id=' + this.params.appId + '&display=page&redirect_uri=http://localhost:3000/verify&scope=friends,email&response_type=code&v=5.37',
                    content: 'Кнопка'
                },
                /*
                {
                    elem: 'button-auth'
                },
                {
                    attrs: {
                        id: 'vk_api_transport'
                    }
                },
                this._initOpenApi()
                */
            ]);

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

    }
);
