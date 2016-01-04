modules.define(
    's-speaker',
    ['i-bem__dom', 'jquery', 'BEMHTML', 'select-poem'],
    function(provide, BEMDOM, $, BEMHTML, spoem) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {

                        //this._getPoem(1);

                        this.currentPoem = {};
                        this.modal = this.findBlockInside('modal');

                        window.socket.on('s-speaker:poem', this._sSpeakerPoem.bind(this));

                        spoem.on('finish', this._startNextStep, this);

                    }

                }

            },

            unbindEvents: function() {
                window.socket.removeAllListeners('s-speaker:poem');
                spoem.un('finish', this._startNextStep, this);
            },

            _startNextStep: function(e, finishedStep) {

                var nextStep =  finishedStep === 'select-poem' ? 'read' : 'select-poem';

                this.findBlockInside({ block: 'checkbox', modName: 'act', modVal: finishedStep }).setMod('checked', true);

                this.modal.setMod('visible', false);

                switch(nextStep) {
                    case 'select-poem':
                        break;
                    case 'read':
                        break;
                }


                console.log('_startNextStep');
                return this;
            },

            _sSpeakerPoem: function(poem) {

                this.currentPoem = poem;

                BEMDOM.update(this.elem('poem-text'), BEMHTML.apply([
                    {
                        block: 's-speaker',
                        elem: 'title',
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

            },

            _getPoem: function(poemId) {
                this.bm = new BM25();
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


            /**
             * Выбираем событие по клику на строку и передаём управление
             *
             * @param e
             * @returns {_onLinePointerClick}
             * @private
             */
            _onLinePointerClick: function(e) {

                if (this.hasMod($(e.currentTarget), 'disabled')) {
                    return this;
                }

                if (this.hasMod($(e.currentTarget), 'num')) {
                    var num = +this.getMod($(e.currentTarget), 'num');
                } else if (this.hasMod($(e.currentTarget), 'act')) {
                    var act = this.getMod($(e.currentTarget), 'act');
                }

                if (act) {

                    var elem = this.modal.elem('content');

                    BEMDOM.destruct(elem, true);
                    BEMDOM.update(elem, BEMHTML.apply({
                        block: act,
                        js: true
                    }));

                    this.modal.setMod('visible', true);

                }

                return this;
            },

            /*
            _onLinePointerClick: function(e) {
                var num = +this.getMod($(e.currentTarget), 'num');

                this._setImage(num + 1);

                return this;
            },
            */

            _destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
            }

        }, {
            live: function() {

                this
                    .liveBindTo('line', 'pointerclick', function (e) {
                        this._onLinePointerClick(e);
                    });

                /*
                    .liveBindTo('line', 'mouseover pointerclick', function (e) {
                        this._onLinePointerClick(e);
                    })
                    .liveBindTo('line', 'mouseout', function (e) {
                        this.delMod(this.elem('line'), 'selected');
                    });
                */

                return false;
            }
        }));
    }
);
