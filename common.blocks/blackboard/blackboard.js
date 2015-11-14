modules.define(
    'blackboard',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {


                }
            }

        }, {
            live: true
        }));
    }
);
