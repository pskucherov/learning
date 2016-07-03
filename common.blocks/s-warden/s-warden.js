modules.define(
    's-warden',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {

                        this.modals = {};
                        _.forEach(this.findBlocksInside('modal') || [], function(item) {
                            var mod = item.getMod('add');
                            this.modals[mod] = item;
                        }.bind(this));

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

                var mod = this.getMod($(e.currentTarget), 'add');

                if (!_.isEmpty(this.modals[mod])) {
                    this.modals[mod].setMod('visible', true);
                }

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
