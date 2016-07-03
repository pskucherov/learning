modules.define(
    'rating',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl({ block: this.name, modName: 's-brain', modVal: 'yes' }, {
            onSetMod: {
                js: {
                    inited: function() {
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
                this.__base.apply(this, arguments);
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

                this.__base.apply(this, arguments);

                return false;
            }
        }));
    }
);
