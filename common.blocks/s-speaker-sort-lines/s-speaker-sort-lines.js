modules.define(
    's-speaker-sort-lines',
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

                        window.socket.on('s-speaker-sort-lines:save', this._saveStep.bind(this));

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


                BEMDOM.update(this.elem('poems'), BEMHTML.apply({
                    block: 's-speaker-sort-lines',
                    elem: 'poems',
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
                this.toggleMod(this.elem('buttons'), 'hidden', true);

                return this;
            },

            /**
             * Отправить на сервер инфу о том, что надо перейти к следующему шагу
             *
             * @returns {_save}
             * @private
             */
            _save: function() {

                if (this.buttonSave.hasMod('disabled')) {
                    return this;
                }

                window.socket.emit('s-speaker-sort-lines:save', {
                    poemId: this.currentPoemId,
                    act: 's-speaker-sort-lines'
                });

                return this;
            },

            /**
             * Перейти на следующий шаг,
             * если сервер вернул ок результат
             *
             * @param result
             * @returns {_saveStep}
             * @private
             */
            _saveStep: function(pId) {
                if (!pId) {
                    this._toggleForm();
                } else {
                    this.emit('finish', {
                        act: 's-speaker-sort-lines',
                        pId: pId
                    });
                    BEMDOM.destruct(this.domElem, false);
                }

                return this;
            }


        }, {
            live: function() {
                this
                    .liveBindTo('button-save', 'pointerclick', function (e) {
                        this._save();
                    });

                return false;
            }
        }
        ));
    }
);
