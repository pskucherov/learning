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
            },

            /**
             * @param e
             * @returns {_onPointerClick}
             * @private
             */
            _onPointerClick: function(e) {

                this.findBlockInside('modal').setMod('visible', true);

                return this;
            }

        }, {
            live: function() {

                this
                    .liveBindTo('item', ' pointerclick', function (e) {
                        this._onPointerClick(e);
                    });

                return false;
            }
        }));
    }
);
