modules.define(
    'rating',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {

                        /**
                         * Получение данных от сервера,
                         * это был правильный ответ на вопрос или нет.
                         *
                         * @params {Boolean} isRight
                         */
                        window.socket.on('rating:rating', function (rating) {
                            this._hideUser();
                            rating.forEach(function (u) {

                                this
                                    ._setUser(u)
                                    ._setFade(u);

                            }.bind(this));

                            if (rating.length > 3) {
                                this.delMod(this.elem('user', 'pos', 100500), 'hidden');
                            }
                            if (rating.length > 4) {
                                this.delMod(this.elem('dots'), 'hidden');
                            }

                        }.bind(this));

                    }
                }
            },

            unbindEvents: function() {
                window.socket.removeAllListeners('rating:rating');
            },

            destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
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
                    ? this.elem(elName, 'pos', u.RowNumber)
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
             * @param pos
             * @returns {_onPointerClick}
             * @private
             */
            _onPointerClick: function(e, pos) {
                if (e.type === 'pointerclick' && !this.hasMod(this.elem('fade', 'pos', pos), 'hidden')) {
                    this._hidePoints(pos);
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
             * @param pos
             * @returns {_hidePoints}
             * @private
             */
            _hidePoints: function(pos) {
                return this
                    .setMod(this.elem('fade', 'pos', pos), 'hidden', 'yes')
                    .setMod(this.elem('stat-text', 'pos', pos), 'hidden', 'yes');
            },

            /**
             *
             * @param e
             * @returns {*|String|Boolean}
             * @private
             */
            _getPos: function(e) {
                return this.getMod($(e.currentTarget), 'pos');
            }

        },

        {
            live: function() {
                var timer = [];

                this
                    .liveBindTo('stats', 'mouseover pointerclick', function (e) {
                        var pos = this._getPos(e),
                            t = timer[pos];

                        t && clearTimeout(t);
                        this._onPointerClick(e, pos);
                    })

                    // Чтобы попап сам скрывался после того, как пользователь убрал курсор
                    .liveBindTo('stats', 'mouseout', function(e) {
                        var pos = this._getPos(e);

                        timer[pos] = setTimeout(function() {
                            this._hidePoints(pos);
                        }.bind(this), 250);
                    });

                return false;
            }
        }));

    }
);
