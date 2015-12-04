modules.define(
    'rating',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {

                    /**
                     * Получение данных от сервера,
                     * это был правильный ответ на вопрос или нет.
                     *
                     * @params {Boolean} isRight
                     */
                    window.socket.on('rating:rating', function(rating) {
                        rating.forEach(function(u) {
                            var e = $(this.elem('user', 'pos', (u.RowNumber-1))).css('background', 'url(' + u.user.photo_100 + ')');
                        }.bind(this));
                    }.bind(this));


                }
            }


        }));
    }
);
