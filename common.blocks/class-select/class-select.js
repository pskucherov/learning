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


                    this
                        ._sendCurrentClass()
                        .on('change', _.debounce(this._onChange.bind(this), 400));

                }
            },

            _sendCurrentClass: function() {
                window.socket.emit('class-select:change', $.cookie('classNum') || 1);
                return this;
            },

            _onChange: function(e, classNum) {
                $.cookie('classNum', classNum);
                this._sendCurrentClass();
                return this;
            }

        }));
    }
);
