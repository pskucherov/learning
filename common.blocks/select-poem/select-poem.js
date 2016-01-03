modules.define(
    'select-poem',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: {
                    inited: function() {
                        this.__base.apply(this, arguments);

                        window.socket.on('select-poem:getPoemByNameAndAuthor', this.setSelectedPoemInModal.bind(this));
                    }
                }
            },

            setSelectedPoemInModal: function(poem) {

                if (_.isEmpty(poem)) {
                    this.__self.enableYaSearchButton();
                    this.__self.setMessageInPlaceholder();
                    return this;
                }

                this.__self.setTextareaVal(poem[0].poem.map(function(item) {
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
            }

        }, {

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

            setTextareaVal: function(text) {
                $('.select-poem__text .textarea_act_text').val(text);
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
                return $('.suggest_act_author .input__control').val();
            },

            setAuthor: function(val) {
                return $('.suggest_act_author .input__control').val(val);
            },

            getPoemName: function() {
                return $('.suggest_act_poem .input__control').val();
            },

            setPoemName: function(val) {
                return $('.suggest_act_poem .input__control').val(val);
            },

            live: function() {

                this
                    .liveBindTo('button-reset', 'pointerclick', function (e) {
                        this._reset();
                    });

                return false;
            }

        }));
    }
);
