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
                        this._hideUser();
                        rating.forEach(function(u) {

                            this
                                ._setUser(u)
                                ._setFade(u);

                        }.bind(this));

                        if (rating.length > 3) {
                            this.delMod(this.elem('dots'), 'hidden');
                            this.delMod(this.elem('user', 'pos', 100500), 'hidden');
                        }

                    }.bind(this));

                }
            },

            /**
             * Устанавливает аватару пользователя и показывает его
             *
             * @param {Object} u - объект пользователя со статистикой
             * @returns {_setUser}
             * @private
             */
            _setUser: function(u) {
                var e = this._getElem('user', u);

                e && $(e).css({ 'background-image': 'url(' + u.user.photo_100 + ')', 'background-size': 'cover' });
                this.delMod(e, 'hidden');

                return this;
            },

            /**
             * Устанавливает аватару пользователя и показывает его
             *
             * @param {Object} u - объект пользователя со статистикой
             * @returns {_setUser}
             * @private
             */
            _setFade: function(u) {
                var e = this._getElem('stat-text', u);
                e && e.html(u.cnt + '<br>' + BEMDOM.blocks['i-utils'].declOfNum(u.cnt, ['очко', 'очка', 'очков']));
                return this;
            },

            /**
             * Получить элемент блока по параметрам
             *
             * @param {String} elName - название элемента, который надо получить
             * @param {Object} u - объект пользователя со статистикой
             * @returns {*}
             * @private
             */
            _getElem: function(elName, u) {
                return u.RowNumber <= 3
                    ? this.elem(elName, 'pos', (u.RowNumber-1))
                    : this.elem(elName, 'pos', 100500);
            },

            /**
             * Скрыть элементы рейтинга
             * @private
             */
            _hideUser: function() {
                this
                    .setMod(this.elem('user'), 'hidden', 'yes')
                    .setMod(this.elem('fade'), 'hidden', 'yes')
                    .setMod(this.elem('stat-text'), 'hidden', 'yes')
                    .setMod(this.elem('dots'), 'hidden', 'yes');
            },

            /**
             * При наведении на статус - показываем,
             * предварительно скрыв все попапы.
             * При клике на статус переключаем видимость попапа.
             *
             * @param e
             * @returns {_onPointerClick}
             * @private
             */
            _onPointerClick: function(e) {
                var currentElem = $(e.currentTarget),
                    pos = this.getMod(currentElem, 'pos');

                if (e.type === 'pointerclick' && !this.hasMod(this.elem('fade', 'pos', pos), 'hidden')) {
                    this._hidePoints(e);
                } else {
                    this
                        .delMod(this.elem('fade', 'pos', pos), 'hidden')
                        .delMod(this.elem('stat-text', 'pos', pos), 'hidden');
                }

                return this;
            },

            /**
             * Скрыть инфу про очки и показать бейдж
             *
             * @param e
             * @returns {_hidePoints}
             * @private
             */
            _hidePoints: function(e) {
                var currentElem = $(e.currentTarget),
                    pos = this.getMod(currentElem, 'pos');

                return this
                    .setMod(this.elem('fade', 'pos', pos), 'hidden', 'yes')
                    .setMod(this.elem('stat-text', 'pos', pos), 'hidden', 'yes');
            }
            
        },

        {
            live: function() {
                var timer;

                this
                    .liveBindTo('stats', 'mouseover pointerclick', function (e) {
                        clearTimeout(timer);
                        this._onPointerClick(e);
                    })

                    // Чтобы попап сам скрывался после того, как пользователь убрал курсор
                    .liveBindTo('stats', 'mouseout', function(e) {
                        timer = setTimeout(function() {
                            this._hidePoints(e);
                        }.bind(this), 250);
                    });

                return false;
            }
        }));

    }
);
