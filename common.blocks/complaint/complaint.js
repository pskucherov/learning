modules.define(
    'complaint',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: function() {

                    this.modal = this.findBlockInside('modal');
                    BEMDOM.blocks['complaint-button'].on('complaint-button:click', this._setComplaint, this);
                    BEMDOM.blocks['s-brain'].on('s-brain:new-question', this._setQuestionId, this);

                }
            },

            // TODO: написать метод анбинда от событий

            /**
             * Сохранить Id вопроса, который надо отправить на сервер для понимания,
             * на что жалуются.
             *
             * @param e
             * @param {Number} qId
             * @private
             */
            _setQuestionId: function(e, qId) {
                this._idToSend = qId;
                return this;
            },

            /**
             * Если кликнули на кнопку отправить форму.
             * Обрабатываем форму, отправляем её и показываем ответ.
             *
             * @param e
             * @returns {_onSendButtonClick}
             * @private
             */
            _onSendButtonClick: function(e) {

                var form = $('#form-complaint-send'),
                    formContent = form.serializeArray(),
                    actionUrl = form.attr('action'),
                    preparedFormContent;

                if (_.isEmpty(formContent) || (formContent.length === 1 && !formContent[0].value)) {
                    return;
                }

                for (var k in formContent) {
                    if (formContent[k].value === '') {
                        delete formContent[k];
                    }
                }

                formContent.push(
                    { qId: this._idToSend },
                    { type: 1 }
                );

                preparedFormContent = this._prepareContent(formContent);

                var ajaxValsStringify = JSON.stringify(preparedFormContent);

                this
                    .setSpin()
                    .emit('complaint:sended')
                    ._sendForm(ajaxValsStringify, actionUrl);

                return this;
            },

            /**
             * Подготовить данные для отправки
             *
             * @param {Object[]} formContent
             * @returns {*}
             * @private
             */
            _prepareContent: function(formContent) {
                var preparedFormContent = {};

                _.forEach(formContent, function(item) {
                    if (_.isEmpty(item)) {
                        return;
                    }

                    if (item.name && item.value) {
                        preparedFormContent[item.name]
                            ? preparedFormContent[item.name] += ',' + item.value
                            : preparedFormContent[item.name] = item.value;
                    } else {
                        for (var k in item) {
                            preparedFormContent[k] = item[k];
                        }
                    }
                });

                return preparedFormContent;
            },

            /**
             * Отправляем данные формы аяксом
             *
             * @param {JSON.string} ajaxValsStringify
             * @param {String} actionUrl
             * @private
             */
            _sendForm: function(ajaxValsStringify, actionUrl) {

                // TODO: переписать на WS
                $.post(actionUrl, { complaintJson: ajaxValsStringify }, function (response) {
                    this.setContent(BEMHTML.apply({
                        block: 'complaint',
                        elem: 'answer',
                        content: 'Жалоба отправлена<br><br>Рассмотрим её в ближайшее время<br><br>Спасибо за обращение'
                    }));
                }.bind(this), 'html');

            },

            /**
             * Вставляем поля формы для данного типа жалобы.
             *
             * @returns {_setComplaint}
             * @private
             */
            _setComplaint: function() {
                var elem = this.modal.elem('content');
                BEMDOM.destruct(elem, true);
                BEMDOM.update(elem, BEMHTML.apply(this.params.complaints));
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
             * Вставляет данные в попап
             *
             * @param {String} html
             * @returns {setContent}
             */
            setContent: function(html) {
                this.modal.elem('content').html(html);
                return this;
            }

        }, {
            live: function() {
                this
                    .liveBindTo('send-button', 'pointerclick', function (e) {
                        e.preventDefault();
                        this._onSendButtonClick(e);
                    });

                return false;
            }
        }));
    }
);
