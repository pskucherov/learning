modules.define(
    'select-poem',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: {
                    inited: function() {
                        this.__base.apply(this, arguments);

                        this.currentPoemId = 0;

                        window.socket.on('select-poem:getPoemByNameAndAuthor', this.setSelectedPoemInModal.bind(this));
                    }
                }
            },

            setSelectedPoemInModal: function(poem) {

                if (_.isEmpty(poem)) {
                    this.currentPoemId = 0;
                    this.__self.enableYaSearchButton();
                    this.__self.setMessageInPlaceholder();
                    return this;
                }

                var p = poem[0];

                this.currentPoemId = p.id;

                this.__self.setTextareaVal(p.poem.map(function(item) {
                        return item.line + (item.nextEmpLine ? '\n' : '');
                    }).join('\n')
                );

            },

            /**
             * Сбросить форму выбора стихотворения
             * TODO: отправка сообщения на сервер и обработка в БД
             * @private
             */
            _reset: function() {
                this.__self.setAuthor('');
                this.__self.setPoemName('');
                this.__self.setTextareaVal('');
                this.__self.setPlaceholder('Здесь будет содержание');
                this.__self.disableYaSearchButton();

                return this;
            },

            /**
             * Смотрит на поля формы, если что-то не заполнено, то подсвечивает это поле
             * @returns {boolean}
             * @private
             */
            _validateForm: function() {
                var author = this.__self.getAuthor(),
                    name = this.__self.getPoemName(),
                    poem = this.__self.getTextareaVal();

                if (!_.isEmpty(author) && !_.isEmpty(name) && !_.isEmpty(poem)) {
                    return true;
                }

                if (_.isEmpty(author)) {
                    this.__self.setAuthorError();
                }
                if (_.isEmpty(name)) {
                    this.__self.setPoemNameError();
                }
                if (_.isEmpty(poem)) {
                    this.__self.setPoemError();
                }

                setTimeout(function() {
                    this.__self.clearError();
                }.bind(this), 300);

                return false;
            },

            _save: function() {

                if (this._validateForm()) {

                    window.socket.emit('select-poem:saveFirstStep', this.currentPoemId
                        ? { poemId: this.currentPoemId }
                        : {
                            author: this.__self.getAuthor(),
                            name: this.__self.getPoemName(),
                            poem: this.__self.getTextareaVal()
                        }
                    );

                }

                return this;
            }

        }, {

            // TODO: надо бы всё это переписать по БЭМу, а то чёт я разогнался )))
            // очевидно, что выставлять модификаторы занимало бы сильно меньше места.
            // + лишний поиск элементов в DOM-ноде.
            // в общем, так лучше не делать ... даже в 4 часа утра ... даже если это никто не будет ревьювить :)

            setAuthorError: function() {
                $('.suggest_act_author .input')[0].className += ' input_error';
            },
            setPoemNameError: function() {
                $('.suggest_act_poem .input')[0].className += ' input_error';
            },
            setPoemError: function() {
                $('.select-poem__text .textarea_act_text')[0].className += ' textarea_error';
            },

            clearError: function() {
                var i = $('.suggest_act_author .input')[0],
                    n = $('.suggest_act_poem .input')[0],
                    p = $('.select-poem__text .textarea_act_text')[0];

                [i, n].forEach(function(item) {
                    item.className = item.className.replace(/input_error/i, '');
                });
                p.className = p.className.replace(/textarea_error/i, '');
            },

            disableYaSearchButton: function() {
                var bSearch = $('.select-poem__button-search');
                bSearch[0].className += ' button_disabled';
                bSearch.attr('aria-disabled', true);
            },

            /**
             * Включить кнопку "найти в яндекс" и подставить в урл значения стиха
             */
            enableYaSearchButton: function() {
                var bSearch = $('.select-poem__button-search');
                bSearch[0].className = bSearch[0].className.replace(/button_disabled/i, '');
                //bSearch.data('bem').button.url
                bSearch.attr('href', 'https://yandex.ru/search/?text='
                    + encodeURIComponent('Стихотворение '
                        + this.getAuthor() + ' '
                        + this.getPoemName()
                    )
                );
                bSearch.removeAttr('aria-disabled');
            },

            setMessageInPlaceholder: function() {
                var author = this.getAuthor(),
                    name = this.getPoemName();

                this.setPlaceholder('К сожалению, в базе нет "' + name + '"' + (author ? ', автора "' + author + '"' : '') + '.\n\n' +
                            //'Воспользуейтесь голосовым вводом, чтобы продиктовать стихотворение.\n\n' +
                        'Подсказка: можно найти стихотворение в Яндекс и добавить в это поле ;)');

            },

            /**
             * Установить подсказку в поле ввода
             */
            setPlaceholder: function(val) {
                return $('.select-poem__text .textarea_act_text').attr('placeholder', val);
            },

            getPoemIfExists: function() {

                var author = this.getAuthor(),
                    name = this.getPoemName();

                if (!_.isEmpty(author) && !_.isEmpty(name)) {
                    window.socket.emit('select-poem:getPoemByNameAndAuthor', {
                        author: author,
                        name: name
                    });
                }

            },

            getAuthor: function() {
                return _.trim($('.suggest_act_author .input__control').val());
            },

            setAuthor: function(val) {
                return $('.suggest_act_author .input__control').val(val);
            },

            getPoemName: function() {
                return _.trim($('.suggest_act_poem .input__control').val());
            },

            setPoemName: function(val) {
                return $('.suggest_act_poem .input__control').val(val);
            },

            setTextareaVal: function(text) {
                return $('.select-poem__text .textarea_act_text').val(text);
            },

            getTextareaVal: function() {
                return _.trim($('.select-poem__text .textarea_act_text').val());
            },

            live: function() {

                this
                    .liveBindTo('button-reset', 'pointerclick', function (e) {
                        this._reset();
                    })
                    .liveBindTo('button-save', 'pointerclick', function (e) {
                        this._save();
                    });

                return false;
            }

        }));
    }
);
