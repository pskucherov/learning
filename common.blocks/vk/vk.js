modules.define(
    'vk',
    ['i-bem__dom', 'jquery'],
    function(provide, BEMDOM, $) {

        provide(BEMDOM.decl('vk', {
            onSetMod: {
                js: function() {

                    window.vkAsyncInit = function () {
                        VK.init({
                            apiId: this.params.appId
                        });

                        VK.Observer.subscribe('auth.sessionChange', function () {
                            VK.Auth.getLoginStatus(window.authInfo);
                        });

                        window.checkAuthInfo && VK.Auth.getLoginStatus(window.authInfo);
                    }.bind(this);

                    window.authInfo || (window.authInfo = function (response) {
                        // TODO: выпилить или вынести под debug
                        console.log(response);
                    });

                    setTimeout(function() {
                        var el = document.createElement("script");
                        el.type = "text/javascript";
                        el.src = "//vk.com/js/api/openapi.js";
                        el.async = true;
                        document.getElementById("vk_api_transport").appendChild(el);
                    }, 0);

                }
            }
        }, {
            /**
             * Выйти из класса
             * @private
             */
            logout: function () {
                var cookieName = 'vk_app_' + _.get($('.vk').data('bem'), '.vk.appId', 0);

                // TODO: привести работу с куками в порядок.
                document.cookie = cookieName + '=; expires=Fri, 31 Dec 9999 23:59:59 GMT; Path=/;';
                document.cookie = cookieName + '=; domain=' + window.location.host + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; Path=/;';
                document.cookie = cookieName + '=; domain=.' + window.location.host + '; expires=Fri, 31 Dec 9999 23:59:59 GMT; Path=/;';
                window.location.href = '/';
            }
        }));
    }
);
