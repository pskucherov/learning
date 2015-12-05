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
                        this._hideNotUsedPos();
                        rating.forEach(function(u) {

                            var e = u.RowNumber <= 2
                                ? this.elem('user', 'pos', (u.RowNumber-1))
                                : this.elem('user', 'pos', 100500);

                            $(e).css({ 'background-image': 'url(' + u.user.photo_100 + ')', 'background-size': 'cover' });
                            this.delMod(e, 'hidden');
                        }.bind(this));

                        if (rating.length > 3) {
                            this.delMod(this.elem('dots'), 'hidden');
                            this.delMod(this.elem('user', 'pos', 100500), 'hidden');
                        }

                    }.bind(this));

                }
            },

            /**
             * Скрыть элементы рейтинга
             * @private
             */
            _hideNotUsedPos: function() {
                this.setMod(this.elem('user'), 'hidden', 'yes');
                this.setMod(this.elem('dots'), 'hidden', 'yes');
            }


        }));
    }
);
