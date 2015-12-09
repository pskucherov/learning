modules.define(
    'complaint',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            /**
             * При наведении на статус - показываем,
             * предварительно скрыв все попапы.
             * При клике на статус переключаем видимость попапа.
             *
             * @param e
             * @returns {_onPointerClick}
             * @private
             */
            _onPointerClick: function(e) {

                this.modal.setMod('visible', true);

                return this;
            }

        }, {
            live: function() {


                this
                    .liveBindTo('button', 'pointerclick', function (e) {
                        this.modal || (this.modal = this.findBlockInside('modal'));
                        this._onPointerClick(e);
                    });

            }
        }));
    }
);
