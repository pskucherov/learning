modules.define(
    's-consultor',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {
                        this.bindAll();
                    }
                }
            },

            bindAll: function() {
                this.modals = {};
                this.textField = this.elem('textarea');

                _.forEach(this.findBlocksInside('modal') || [], function(item) {
                    var mod = item.getMod('add');
                    this.modals[mod] = item;
                }.bind(this));

                this.bindTo(this.elem('send-question'), 'pointerclick', this._sendQuestionButtonClick, this);

                window.socket.on('s-consultor:addedQuestion', function(isAdded) {
                    if (!isAdded) {
                        return;
                    }
                }.bind(this));
            },

            unbindEvents: function() {
                this.unbindFrom(this.elem('send-question'), 'pointerclick', this._sendQuestionButtonClick, this);
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
                    this.modal = this.modals[mod];
                    this.modals[mod].setMod('visible', true);
                }

                return this;
            },

            /**
             * Клик по кнопке отправить вопрос на модерацию
             *
             * @param e
             * @returns {_sendQuestionButtonClick}
             * @private
             */
            _sendQuestionButtonClick: function(e) {
                var val = this.textField.val();

                if (_.isEmpty(val)) {
                    return this;
                }

                window.socket.emit('s-consultor:sendQuestion', {
                    question: val
                });

                this.setSpin();

                return this;
            },

            /**
             * Вставляет данные в попап
             *
             * @param {String} html
             * @returns {setContent}
             */
            setContent: function(html) {
                this.modal.elem('content').html(html);
                return this;
            },

            /**
             * Добавить спиннер во внутрь попапа
             *
             * @returns {setSpin}
             */
            setSpin: function() {
                this.setContent(BEMHTML.apply({
                    block: 'spin',
                    mods: {
                        theme: 'islands', size: 'xl', visible: true
                    }
                }));

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
