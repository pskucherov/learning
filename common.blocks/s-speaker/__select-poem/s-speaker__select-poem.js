modules.define(
    's-speaker',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: {
                    inited: function() {

                        this.__base.apply(this, arguments);

                        window.socket.on('s-speaker:getPoemByNameAndAuthor', this.setSelectedPoemInModal.bind(this));
                    }
                }
            },

            setSelectedPoemInModal: function(poem) {

                if (_.isEmpty(poem)) {
                    this.__self.enableYaSearchButton();
                    this.__self.setPlaceholder();
                    return this;
                }

                this.__self.setTextareaVal(poem[0].poem.map(function(item) {
                        return item.line + (item.nextEmpLine ? '\n' : '');
                    }).join('\n')
                );

            }

        }, {

            disableYaSearchButton: function() {
                var bSearch = $('.s-speaker__button-search');
                bSearch[0].className += ' button_disabled';
                bSearch.attr('aria-disabled', true);
            },

            /**
             * Включить кнопку "найти в яндекс" и подставить в урл значения стиха
             */
            enableYaSearchButton: function() {
                var bSearch = $('.s-speaker__button-search');
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
                $('.s-speaker__text .textarea_act_text').val(text);
            },

            /**
             * Установить подсказку в поле ввода
             */
            setPlaceholder: function() {

                var author = this.getAuthor(),
                    name = this.getPoemName();

                $('.s-speaker__text .textarea_act_text')
                    .attr('placeholder', 'К сожалению, в базе нет "' + name + '"' + (author ? ', автора "' + author + '"' : '') + '.\n\n' +
                        //'Воспользуейтесь голосовым вводом, чтобы продиктовать стихотворение.\n\n' +
                        'Подсказка: можно найти стихотворение в Яндекс и добавить в это поле ;)');
            },

            getPoemIfExists: function() {

                var author = this.getAuthor(),
                    name = this.getPoemName();

                if (!_.isEmpty(author) && !_.isEmpty(name)) {
                    window.socket.emit('s-speaker:getPoemByNameAndAuthor', {
                        author: author,
                        name: name
                    });
                }

            },

            /**
             * 
             * @returns {*|jQuery}
             */
            getAuthor: function() {
                return $('.suggest_act_author .input__control').val();
            },

            /**
             *
             * @returns {*|jQuery}
             */
            getPoemName: function() {
                return $('.suggest_act_poem .input__control').val();
            }

        }));
    }
);
