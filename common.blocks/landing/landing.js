modules.define(
    'landing',
    ['i-bem__dom', 'jquery'],
    function(provide, BEMDOM, $) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {
                    var popups = this.findBlocksInside('popup');

                    this.popups = popups && this.findBlocksInside('popup').map(function(item) {
                            return item;
                        });

                }
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

                this.liveBindTo('status', 'mouseover pointerclick', function (e) {
                    clearTimeout(timer);
                    this._onPointerClick(e);
                });

                // Чтобы попап сам скрывался после того, как пользователь убрал курсор
                this.liveBindTo('status', 'mouseout', function() {
                    timer = setTimeout(function() {
                        this._hidePopups();
                    }.bind(this), 250);
                });

                return this.__base.apply(this, arguments);
            }
        }));
    }
);
