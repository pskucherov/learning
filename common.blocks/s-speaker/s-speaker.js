modules.define(
    's-speaker',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {

                    this._getPoem(1);

                    window.socket.on('s-speaker:poem', function(poem) {
                        console.log(poem);




                        BEMDOM.update(this.elem('poem-text'), BEMHTML.apply(
                            poem.poem.map(function(item) {
                                return [
                                    {
                                        block: 's-speaker',
                                        elem: 'line',
                                        mods: {
                                            num: item.line_num
                                        },
                                        content: item.line
                                    },
                                    item.nextEmpLine ? {
                                        tag: 'br'
                                    } : ''
                                ];
                            })
                        ));

                    }.bind(this));

                }
            },

            _getPoem: function(poemId) {
                window.socket.emit('s-speaker:get-poem', poemId);
            },


        }, {
            live: function() {


                return false;
            }
        }));
    }
);
