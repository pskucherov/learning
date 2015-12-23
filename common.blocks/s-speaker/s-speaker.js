modules.define(
    's-speaker',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {

                    this.bm = new BM25();

                    this._getPoem(1);

                    this.currentPoem = {};

                    window.socket.on('s-speaker:poem', function(poem) {
                        console.log(poem);

                        this.currentPoem = poem;

                        BEMDOM.update(this.elem('poem-text'), BEMHTML.apply([
                            {
                                block: 's-speaker',
                                elem: 'poem-title',
                                content: poem.name
                            },
                            {
                                tag: 'br'
                            },
                            poem.poem.map(function(item) {
                                var i = new Image;

                                i.src = item.imageUrl;

                                this.bm.addDocument({ id: item.line_num, body: item.line });

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
                            }.bind(this)),
                            {
                                tag: 'br'
                            },
                            {
                                block: 's-speaker',
                                elem: 'poem-author',
                                content: poem.author
                            }
                        ]));


                        ya.speechkit.recognize({
                            resultCallBackBuf: function(text) {
                                if (!text) {
                                    return;
                                }
                                var num = this.bm.search(text);

                                if (typeof num === 'number' && num >= 0) {
                                    console.log(num);
                                    this._setImage(num + 1);
                                }

                                //console.log('here ' + text);
                            }.bind(this),
                            doneCallback: function (text) {
                                console.log("You've said: " + text);
                            },
                            initCallback: function () {
                                console.log("You may speak now");
                            },
                            errorCallback: function (err) {
                                console.log("Something gone wrong: " + err);
                            },
                            model: 'freeform', // Model name for recognition process
                            lang: 'ru-RU', //Language for recognition process
                            apiKey: 'ee18d8a0-5813-4657-9469-972ba94af634'
                        });


                        this._setImage(0);

                    }.bind(this));

                }
            },

            _getPoem: function(poemId) {
                window.socket.emit('s-speaker:get-poem', poemId);
            },

            _setImage: function(line) {

                if (line === this.currentLine) {
                    //return;
                }

                var v = this.elem('visualisation');
                this.currentLine = line;

                this.delMod(this.elem('line'), 'selected');

                if (line) {
                    this.setMod(this.elem('line', 'num', (line-1)), 'selected', 'yes');
                }

                /*
                if (!v.css('opacity')) {
                    v.css({
                        'background-image': 'url(' + this.currentPoem.poem[line].imageUrl + ')',
                        'background-size': 'contain',
                        'background-repeat': 'no-repeat',
                        'background-position': 'center'
                    });
                    v.animate({opacity: 1}, 500);
                } else {
                    v.animate({opacity: 0}, 500, function () {
                        v.css({
                            'background-image': 'url(' + this.currentPoem.poem[line].imageUrl + ')',
                            'background-size': 'contain',
                            'background-repeat': 'no-repeat',
                            'background-position': 'center'
                        });
                        v.animate({opacity: 1}, 500);
                    }.bind(this));
                }
                */

                return this;
            },

            _onPointerClick: function(e) {
                var num = +this.getMod($(e.currentTarget), 'num');

                this._setImage(num + 1);

                return this;
            }

        }, {
            live: function() {

                this
                    .liveBindTo('line', 'mouseover pointerclick', function (e) {
                        this._onPointerClick(e);
                    })
                    .liveBindTo('line', 'mouseout', function (e) {
                        this.delMod(this.elem('line'), 'selected');
                    });

                return false;
            }
        }));
    }
);
