modules.define(
    'landing',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {
                    var popups = this.findBlocksInside('popup');

                    this.popups = popups && this.findBlocksInside('popup').map(function(item) {
                            return item;
                        });

                    BEMDOM.blocks['s-brain'].on('up', this._showPlusPoint, this);

                    window.socket.on('user:rating', this._setPopupContent.bind(this));

                }
            },

            /**
             * Установить контент попапа для статуса
             *
             * @param data
             * @returns {_setPopupContent}
             * @private
             */
            _setPopupContent: function(data) {
                _.forEach(data, function(item, num) {
                    var popup = this.popups[num];

                    popup && popup.domElem.html(BEMHTML.apply({
                        content: 'Баллов: ' + item.rightAnswers
                    }));
                }.bind(this));

                return this;
            },

            /**
             * Анимашка значка +1 для статуса
             * Сдвигаем статус в нужное положение, относительно статуса
             * и производим анимацию показа и скрывания
             *
             * @param e
             * @param statusNum
             * @returns {_showPlusPoint}
             * @private
             */
            _showPlusPoint: function(e, statusNum) {
                var status = this.elem('status', 'num', statusNum),
                    plusPoint = this.elem('plus-point'),
                    calcOffset =  status.position().left + status.width() - 20;

                    plusPoint.css({top: 10, left: calcOffset, visibility: 'visible'});
                    plusPoint.css({top: -20, left: calcOffset});

                    setTimeout(function () {
                        plusPoint.css({top: 10, visibility: 'hidden'});
                    }, 1500);

                /*
                // TODO: есть ещё вариант поиграться с прозрачностью,
                // чтобы +1 появлялся и скрывался в одном положении, но пока так.
                plusPoint.animate({ top: 0 }, 300, function() {
                    //setTimeout(function() {
                        plusPoint.animate({ top: -20 }, 400, function() {
                            plusPoint.css('visibility', 'hidden');
                        });
                   // }, 100);
                });
                */

                return this;
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
                var num = this.getMod($(e.currentTarget), 'num'),
                    currentElem = this.findElem('status', 'num', num),
                    popup = this.popups[num];

                if (_.isEmpty(popup) ||
                    (e.target && _.get(e, 'target.className').indexOf('image') === -1)) {
                    return this;
                }

                if (popup.getMod('visible') && e.type === 'pointerclick') {
                    popup.setMod('visible', false);
                } else {
                    this._hidePopups();
                    popup.setAnchor(currentElem);
                    popup.setMod('visible', true);
                }

                return this;
            },

            /**
             * Скрыть все попапы
             *
             * @returns {_hidePopups}
             * @private
             */
            _hidePopups: function() {
                !_.isEmpty(this.popups) && this.popups.forEach(function(popup) {
                    popup.setMod('visible', false);
                });

                return this;
            }

        }, {
            live: function() {

                var timer;

                this
                    .liveBindTo('status', 'mouseover pointerclick', function (e) {
                        clearTimeout(timer);
                        this._onPointerClick(e);
                    })

                    // Чтобы попап сам скрывался после того, как пользователь убрал курсор
                    .liveBindTo('status', 'mouseout', function() {
                        timer = setTimeout(function() {
                            this._hidePopups();
                        }.bind(this), 250);
                    });

                return false;
            }
        }));
    }
);
