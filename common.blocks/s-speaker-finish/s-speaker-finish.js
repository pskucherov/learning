modules.define(
    's-speaker-finish',
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
                            window.socket.emit('s-speaker-finish:get-progress', this.currentPoemId);
                        }

                        window.socket.on('s-speaker-finish:progress', function(progress) {
                            this._toggleForm();
                            console.log(progress);

                            this._setDuration(progress.deltaTime);

                            this.bindEvents();
                        }.bind(this));


                    }
                }
            },

            bindEvents: function() {

            },

            unbindEvents: function() {

            },

            _destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
            },

            /**
             * Вставить время изучения стихотворения
             * @param delta
             * @private
             */
            _setDuration: function(delta) {
                var duration = BEMDOM.blocks['i-utils'].parseMicroseconds(delta);

                BEMDOM.update(this.elem('duration'), BEMHTML.apply({
                    block: 'spent-time',
                    duration: duration
                }));
            },

            /**
             * Поменять состояние формы
             * @private
             */
            _toggleForm: function() {
                this.spin.toggleMod('visible', true);
                this.toggleMod(this.elem('buttons'), 'hidden', true);

                return this;
            }


        }, {
            live: function() {

                return false;
            }
        }
        ));
    }
);
