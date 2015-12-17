modules.define(
    's-speaker',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {

                    this._getPoem(1);

                    this.currentPoem = {};

                    window.socket.on('s-speaker:poem', function(poem) {
                        console.log(poem);

                        this.currentPoem = poem;

                        BEMDOM.update(this.elem('poem-text'), BEMHTML.apply(
                            poem.poem.map(function(item) {
                                var i = new Image;

                                i.src = item.imageUrl;

                                return [
                                    {
                                        block: 's-speaker',
                                        elem: 'line',
                                        mods: {
                                            num: item.line_num - 1
                                        },
                                        content: item.line
                                    },
                                    item.nextEmpLine ? {
                                        tag: 'br'
                                    } : ''
                                ];
                            })
                        ));

                        this._setImage(1);

                    }.bind(this));

                }
            },

            _getPoem: function(poemId) {
                window.socket.emit('s-speaker:get-poem', poemId);
            },

            _setImage: function(line) {

                var v = this.elem('visualisation');

                v.animate({ opacity: 0 }, 500, function() {
                    v.css({
                        'background-image': 'url(' + this.currentPoem.poem[line].imageUrl + ')',
                        'background-size': 'contain',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center'
                    });
                    v.animate({ opacity: 1 }, 500);
                }.bind(this));

                return this;
            },

            _onPointerClick: function(e) {
                var num = this.getMod($(e.currentTarget), 'num');

                this._setImage(num);

                return this;
            }

        }, {
            live: function() {

                this
                    .liveBindTo('line', 'mouseover pointerclick', function (e) {
                        this._onPointerClick(e);
                    });

                return false;
            }
        }));
    }
);
