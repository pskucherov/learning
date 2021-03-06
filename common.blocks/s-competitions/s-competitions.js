modules.define(
    's-competitions',
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

                BEMDOM.blocks['s-competitions-item'].on('click', this._onItemClick, this);

                window.socket.on('s-competitions:addedQuestion', function(isAdded) {
                    if (!isAdded) {
                        return;
                    }

                    this.setContent(BEMHTML.apply({
                        block: 's-competitions',
                        elem: 'answer',
                        content: 'Вопрос отправлен на модерацию'
                            + '<br><br>'
                            + 'Проверка произойдёт в течение суток'
                    }));

                }.bind(this));

                window.socket.on('s-competitions:question', function(q) {
                    var qBlockId = 'vk_comments_question',
                        likeBlockId = 'vk_like_question';

                    this.qId = q._id;

                    this.setContent(BEMHTML.apply([
                        {
                            block: 's-competitions',
                            elem: 'answer',
                            content: q.question
                        },
                        {
                            block: 's-competitions',
                            elem: 'like',
                            attrs: { id: likeBlockId }
                        },
                        {
                            attrs: { id: qBlockId }
                        }
                    ]));

                    VK.Observer.unsubscribe('widgets.comments.new_comment', this._commentSubscribe.bind(this));
                    VK.Observer.unsubscribe('widgets.comments.delete_comment', this._commentSubscribe.bind(this));
                    VK.Widgets.Comments(qBlockId, { width: 500, limit: 20 }, q._id);
                    VK.Observer.subscribe('widgets.comments.new_comment', this._commentSubscribe.bind(this));
                    VK.Observer.subscribe('widgets.comments.delete_comment', this._commentSubscribe.bind(this));

                    VK.Observer.unsubscribe('widgets.like.liked', this._likeSubscribe.bind(this));
                    VK.Observer.unsubscribe('widgets.like.unliked', this._likeSubscribe.bind(this));
                    VK.Widgets.Like(likeBlockId, { type: 'button' }, q._id);
                    VK.Observer.subscribe('widgets.like.liked', this._likeSubscribe.bind(this));
                    VK.Observer.subscribe('widgets.like.unliked', this._likeSubscribe.bind(this));

                }.bind(this));
            },

            /**
             * Отправка количества лайков у данного вопроса
             *
             * @param count
             * @private
             */
            _commentSubscribe: function(count) {
                window.socket.emit('s-competitions:setCommentsCount', {
                    qId: this.qId,
                    commentsCount: count
                });
            },

            /**
             * Отправка количества лайков у данного вопроса
             *
             * @param cnt
             * @private
             */
            _likeSubscribe: function(cnt) {
                window.socket.emit('s-competitions:setLikeCnt', {
                    qId: this.qId,
                    likes: cnt
                });
            },

            unbindEvents: function() {
                window.socket.removeAllListeners('s-competitions:question');
                window.socket.removeAllListeners('s-competitions:addedQuestion');
                VK.Observer.unsubscribe('widgets.like.liked', this._likeSubscribe.bind(this));

                this.isInited = false;

                // Уничтожаем попапы, а то они остаются в домноде,
                // а там домноды с id, на которые вк подписывается
                _.forEach(this.modals, function(block) {
                    BEMDOM.destruct(block.domElem, true);
                });

                this.unbindFrom(this.elem('send-question'), 'pointerclick', this._sendQuestionButtonClick, this);
                BEMDOM.blocks['s-competitions-item'].un('click', this._onItemClick, this);
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

                window.socket.emit('s-competitions:sendQuestion', {
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

                    window.socket.emit('s-competitions:showQuestion', {
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
                    .liveBindTo('item', 'pointerclick', function(e) {
                        this.bindAll();
                    })
                    .liveBindTo('show-popup-button', 'pointerclick', function(e) {
                        this.bindAll();
                        this._showQuestionButtonClick(e);
                    });

                return true;
            }
        }));
    }
);
