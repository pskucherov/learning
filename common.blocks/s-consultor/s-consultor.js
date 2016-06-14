modules.define(
    's-consultor',
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
            _showQuestionButtonClick: function(e) {
                var params = this.elemParams('show-popup-button'),
                    mod = params && params.add;

                if (mod && !_.isEmpty(this.modals[mod])) {
                    this.modals[mod].setMod('visible', true);
                }

                return this;
            }


        }, {
            live: function() {
                this
                    .liveBindTo('show-popup-button', 'pointerclick', function(e) {
                        this._showQuestionButtonClick(e);
                    });

                return false;
            }
        }));
    }
);
