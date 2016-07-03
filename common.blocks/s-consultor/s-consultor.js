modules.define(
    's-consultor',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            bindAll: function() {
                if (this.isInited) {
                    return this;
                }

                this.isInited = true;

                this.modals = {};
                this.textField = this.elem('textarea');

                _.forEach(this.findBlocksInside('modal') || [], function(item) {
                    var mod = item.getMod('add');
                    this.modals[mod] = item;
                }.bind(this));

                this.bindTo(this.elem('send-question'), 'pointerclick', this._sendQuestionButtonClick, this);

                BEMDOM.blocks['s-consultor-item'].on('click', this._onItemClick, this);

                window.socket.on('s-consultor:addedQuestion', function(isAdded) {
                    if (!isAdded) {
                        return;
                    }

                    this.setContent(BEMHTML.apply({
                        block: 's-consultor',
                        elem: 'answer',
                        content: 'Вопрос отправлен на модерацию'
                            + '<br><br>'
                            + 'Проверка произойдёт в течение суток'
                    }));

                }.bind(this));

                window.socket.on('s-consultor:question', function(q) {
                    var qBlockId = 'vk_comments_question',
                        likeBlockId = 'vk_like_question';

                    this.setContent(BEMHTML.apply([
                        {
                            block: 's-consultor',
                            elem: 'answer',
                            content: q.question
                        },
                        {
                            block: 's-consultor',
                            elem: 'like',
                            attrs: { id: likeBlockId }
                        },
                        {
                            attrs: { id: qBlockId }
                        }
                    ]));

                    VK.Widgets.Comments(qBlockId, { width: 500, limit: 20 }, q._id);
                    VK.Widgets.Like(likeBlockId, { type: 'button' }, q._id);
                }.bind(this));
            },

            unbindEvents: function() {
                window.socket.removeAllListeners('s-consultor:question');
                window.socket.removeAllListeners('s-consultor:addedQuestion');

                this.unbindFrom(this.elem('send-question'), 'pointerclick', this._sendQuestionButtonClick, this);
                BEMDOM.blocks['s-consultor-item'].un('click', this._onItemClick, this);
            },

            destruct: function() {
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
                this.modal.elem('content').html(BEMHTML.apply({ block: 'modal', elem: 'close' }) + html);
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

            },

            /**
             * Клик по вопросу
             *
             * @param e
             * @param id
             * @returns {_onItemClick}
             * @private
             */
            _onItemClick: function(e, id) {
                var mod = 'question';

                if (!_.isEmpty(this.modals[mod])) {
                    this.modal = this.modals[mod];

                    window.socket.emit('s-consultor:showQuestion', {
                        id: id
                    });
                    this.modal.setMod('visible', true);

                    this.setSpin();
                }

                return this;
            }

        }, {
            live: function() {
                this
                    .liveBindTo('item show-popup-button', 'pointerclick', function(e) {
                        this.bindAll();
                    })
                    .liveBindTo('show-popup-button', 'pointerclick', function(e) {
                        this._showQuestionButtonClick(e);
                    });

                return true;
            }
        }));
    }
);
