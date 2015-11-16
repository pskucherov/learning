modules.define(
    'class-select',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {

                    this.buttons = this.findBlocksInside('radio');

                    this.buttons.length && this.buttons.forEach(function(item, k) {
                        item.on({ modName: 'checked', modVal: true}, function() {
                            var classNum = k + 1;
                            this.emit('change', classNum);
                        }, this);
                    }.bind(this));

                    this.on('change', _.debounce(this._onChange.bind(this), 400));

                }
            },

            _onChange: function(e, classNum) {
                $.cookie('classNum', classNum);
                window.socket.emit('class-select:change', classNum);
                return this;
            }

        }));
    }
);
