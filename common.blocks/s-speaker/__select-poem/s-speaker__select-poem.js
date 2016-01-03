modules.define(
    's-speaker',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

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
                        + $('.suggest_act_author .input__control').val() + ' '
                        + $('.suggest_act_poem .input__control').val()
                    )
                );
                bSearch.removeAttr('aria-disabled');
            },

            /**
             * Установить подсказку в поле ввода
             * @param poemName
             * @param author
             */
            setPlaceholder: function(poemName, author) {
                $('.s-speaker__text .textarea_act_text')
                    .attr('placeholder', 'К сожалению, в базе нет "' + poemName + '"' + (author ? ', автора "' + author + '"' : '') + '.\n\n' +
                        //'Воспользуейтесь голосовым вводом, чтобы продиктовать стихотворение.\n\n' +
                        'Подсказка: можно найти стихотворение в Яндекс и добавить в это поле ;)');
            }

        }));
    }
);
