modules.define(
    's-consultor-item',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            _onItemClick: function(e) {
                this.emit('click', this.params.id);
            }

        }, {
            live: function() {
                this
                    .liveBindTo('pointerclick', function(e) {
                        this._onItemClick(e);
                    });

                return true;
            }
        }));

    }
);
