modules.define(
    'complaint',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: function() {

                    this.modal = this.findBlockInside('modal');
                    BEMDOM.blocks['complaint-button'].on('complaint-button:click', this._setComplaint, this);


                }
            },

            _onSendButtonClick: function(e) {

                this
                    .setSpin()
                    .setContent('Всё ок. Едем дальше.');

                this.emit('complaint:sended');

                //debugger;

            },

            _setComplaint: function() {
                var mContent = this.modal.elem('content');

                mContent.html(BEMHTML.apply(this.params.complaints));

                return this;
            },

            /**
             * Добавить спиннер во внутрь попапа
             *
             * @returns {setSpin}
             */
            setSpin: function() {

                var mContent = this.modal.elem('content');

                mContent.html(BEMHTML.apply({
                    block: 'spin',
                    mods: {
                        theme: 'islands', size: 'xl', visible: true
                    }
                }));

                return this;

            },

            setContent: function(text) {
                var mContent = this.modal.elem('content');

                mContent.html(text);

                //this.showPopUpButton.setMod('disabled', 'yes');
                return this;
            }

        }, {
            live: function() {
                this
                    .liveBindTo('send-button', 'pointerclick', function (e) {
                        //this.showPopUpButton || (this.showPopUpButton = this.findBlockInside(this.elem('show-popup-button'), 'button'));
                        this._onSendButtonClick(e);
                    });

                return false;
            }
        }));
    }
);
