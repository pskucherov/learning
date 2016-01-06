modules.define(
    's-speaker-read',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: {
                    inited: function() {
                        this.__base.apply(this, arguments);

                        this.currentPoemId = this.params.poemId;
                        this.spin = this.findBlockInside('spin');

                        if (this.currentPoemId > 0) {
                            this._toggleForm();
                            window.socket.emit('select-poem:getPoemById', this.currentPoemId);
                        }

                        window.socket.on('select-poem:getPoemById', function(poem) {
                            poem && this.setSelectedPoemInModal([poem]);
                            this._toggleForm();
                        }.bind(this));

                    }
                }
            },

            unbindEvents: function() {
            },

            _destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
            },


            /**
             * Построчно добавляет стих в поле ввода
             *
             * @param poem
             * @returns {setSelectedPoemInModal}
             */
            setSelectedPoemInModal: function(poem) {

                if (_.isEmpty(poem)) {
                    this.currentPoemId = 0;
                    return this;
                }

                var p = poem[0];


                BEMDOM.update(this.elem('poem'), BEMHTML.apply({
                    block: 's-speaker-read',
                    elem: 'poem',
                    title: p.name,
                    author: p.author.name,
                    poem: p.poem
                }));

            },

            /**
             * Поменять состояние формы
             * @private
             */
            _toggleForm: function() {

                this.spin.toggleMod('visible', true);

                return this;
            },

            _onInstructionButtonClick: function() {
                this.toggleMod(this.elem('instruction'), 'hidden', true);
                this.toggleMod(this.elem('poem'), 'hidden', true);
                return this;
            }

        }, {
            live: function() {
                this.liveBindTo('button-instruction', 'pointerclick', function(e) {
                    this._onInstructionButtonClick(e);
                });

                return false;
            }
        }
        ));
    }
);
