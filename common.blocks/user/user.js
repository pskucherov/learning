modules.define(
    'user',
    ['i-bem__dom', 'jquery'],
    function(provide, BEMDOM, $) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {
                    this.popup = this.findBlockInside('popup');
                    this.popup && this.popup.setAnchor(this);
                }
            },
            /**
             * Действие при клике на блок пользователя.
             * @private
             */
            _onPointerClick: function() {
                this.popup && this.popup.toggleMod('visible', true);
            },

            /**
             * Выйти из класса
             * @private
             */
            _onLogout: function() {
                debugger;
                VK && VK.Auth.logout(function() {
                    window.location.href = '/';
                });
            }
        }, {
            live: function() {
                this
                    .liveBindTo('info', 'pointerclick', this.prototype._onPointerClick)
                    .liveBindTo('logout', 'pointerclick', this.prototype._onLogout);

                return this.__base.apply(this, arguments);
            }
        }));
    }
);
