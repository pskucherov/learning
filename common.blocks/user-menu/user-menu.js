modules.define(
    'user-menu',
    ['i-bem__dom', 'jquery'],
    function(provide, BEMDOM, $) {

        provide(BEMDOM.decl(this.name, {


        }, {
            live: function() {
                this.liveBindTo('logout', 'pointerclick', function() {
                    BEMDOM.blocks['vk'].logout();
                });

                return this.__base.apply(this, arguments);
            }
        }));
    }
);
