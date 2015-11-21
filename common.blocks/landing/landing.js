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
             * @param num
             * @returns {_onPointerClick}
             * @private
             */
            _onPointerClick: function(e, num) {
                var popup = this.popups[num];

                if (_.isEmpty(popup) || (e.toElement && _.get(e, 'toElement.className') !== 'image')) {
                    return this;
                }

                if (popup.getMod('visible') && e.type === 'pointerclick') {
                    popup.setMod('visible', false);
                } else {
                    this._hidePopups();
                    popup.setAnchor(this.elem('status' + num));
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

                // 3 = BEMPRIV.block('statuses').listLength
                // TODO: порефакторить на $(e.currentTarget)
                for (var i = 0; i <= 3; i++) {
                    (function(i) {
                        this.liveBindTo('status' + i, 'mouseover pointerclick', function (e) {
                            clearTimeout(timer);
                            this._onPointerClick(e, i);
                        });
                    }).call(this, i);
                }

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
