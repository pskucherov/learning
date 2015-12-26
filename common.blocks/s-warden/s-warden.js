modules.define(
    's-warden',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {


                    }

                }

            },

            unbindEvents: function() {

            },

            _destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
            }

        }, {
            live: function() {



                return false;
            }
        }));
    }
);
