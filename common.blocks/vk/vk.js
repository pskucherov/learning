modules.define(
    'vk',
    ['i-bem__dom', 'jquery'],
    function(provide, VKModule, $) {

        provide(VKModule.decl('vk', {
            onSetMod: {
                js: function() {

                    window.vkAsyncInit = function () {
                        VK.init({
                            apiId: 5076733
                        });

                        VK.Observer.subscribe('auth.sessionChange', function () {
                            VK.Auth.getLoginStatus(window.authInfo);
                        });

                        window.checkAuthInfo && VK.Auth.getLoginStatus(window.authInfo);
                    };

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
        }));
    }
);
