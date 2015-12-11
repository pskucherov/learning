modules.define(
    'complaint-button',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: function() {
                    //BEMDOM.blocks['complaint'].on('complaint:sended', this._onComplaintSended, this);
                    BEMDOM.blocks['complaint'].on('complaint:sended', this._onComplaintSended, this);
                    BEMDOM.blocks['s-brain'].on('s-brain:new-question', this._onGetNewQuestion, this);

                }
            },

            _onComplaintSended: function() {
                this.showPopUpButton || (this.showPopUpButton = this.findBlockInside(this.elem('show-popup-button'), 'button'));
                this.showPopUpButton.setMod('disabled', true);
                return this;
            },

            _onGetNewQuestion: function() {
                this.showPopUpButton || (this.showPopUpButton = this.findBlockInside(this.elem('show-popup-button'), 'button'));
                this.showPopUpButton.delMod('disabled');
                return this;
            },

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

                this.emit('complaint-button:click');

                return this;
            }

        }, {
            live: function() {

                this
                    .liveBindTo('show-popup-button', 'pointerclick', function (e) {
                        this.modal || (this.modal = this.findBlockInside('modal'));
                        this.showPopUpButton || (this.showPopUpButton = this.findBlockInside(this.elem('show-popup-button'), 'button'));

                        if (this.showPopUpButton.hasMod('disabled')) {
                            return;
                        }

                        this._onPointerClick(e);
                    });

                return false;
            }
        }));
    }
);
