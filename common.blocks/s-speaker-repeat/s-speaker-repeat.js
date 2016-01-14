modules.define(
    's-speaker-repeat',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

            onSetMod: {
                js: {
                    inited: function() {
                        this.__base.apply(this, arguments);

                        this.audio = null;

                        this.tts = ya.speechkit.Tts({
                            speaker: 'jane',
                            emotion: 'good',
                            gender: 'female',
                            speed: 1
                        });

                        this.currentPoemId = this.params.poemId;
                        this.spin = this.findBlockInside('spin');

                        if (this.currentPoemId > 0) {
                            this._toggleForm();
                            window.socket.emit('select-poem:getPoemById', this.currentPoemId);
                        }

                        window.socket.on('select-poem:getPoemById', function(poem) {
                            poem && this.setSelectedPoemInModal([poem]);
                            this._toggleForm();

                            this.bindEvents();
                        }.bind(this));

                        window.socket.on('s-speaker-repeat:save', this._saveStep.bind(this));

                    }
                }
            },

            bindEvents: function() {

                this.checkboxes = this.findBlocksInside('checkbox');
                this.buttonSave = this.findBlockInside({ block: 'button', modName: 'button-save', modVal: true });

                _.forEach(this.checkboxes, function(item) {
                    item.on({ modName : 'checked', modVal : '*' }, this._onCheckboxChanged, this);
                }.bind(this));

            },

            /**
             * Если изменился чекбокс во включенное состояние и все остальные чекбоксы так же отмечены,
             * то включаем кнопку сохранения
             *
             * @param e
             * @param checkbox
             * @returns {_onCheckboxChanged}
             * @private
             */
            _onCheckboxChanged: function(e, checkbox) {
                if (checkbox.modVal && this._checkAllCheckbox()) {
                    this.buttonSave.setMod('disabled', false);
                } else {
                    this.buttonSave.setMod('disabled', true);
                }
                return this;
            },

            unbindEvents: function() {
                _.forEach(this.checkboxes, function(item) {
                    item.un({ modName: 'checked', modVal: '*' }, this._onCheckboxChanged, this);
                }.bind(this));

                window.socket.removeAllListeners('select-poem:getPoemById');
                window.socket.removeAllListeners('s-speaker-repeat:save');

                return this;
            },

            _destruct: function() {
                this
                    .unbindEvents()
                    ._clearAudio();
                this.__base.apply(this, arguments);
            },

            /**
             * Проверяет, что все чекбоксы отмечены
             * @returns {boolean}
             * @private
             */
            _checkAllCheckbox: function() {
                return _.every(this.checkboxes, function(item) {
                    return item.hasMod('checked');
                }, true);
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
                    block: 's-speaker-repeat',
                    elem: 'poem',
                    title: p.name,
                    author: p.author.name,
                    poem: p.poem
                }));

                /*
                воспроизведение текста
                var text = '';

                p.poem.forEach(function(item) {
                    text += item.line + ', ';
                });

                text = text.replace(/\.\, /ig, '. ');

                console.log(text);
                this.tts.say(text);
                */

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

            _onInstructionButtonClick: function() {
                this.toggleMod(this.elem('instruction'), 'hidden', true);
                this.toggleMod(this.elem('poem'), 'hidden', true);
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

                window.socket.emit('s-speaker-repeat:save', {
                    poemId: this.currentPoemId,
                    act: 's-speaker-repeat'
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
                        act: 's-speaker-repeat',
                        pId: pId
                    });
                    BEMDOM.destruct(this.domElem, false);
                }

                return this;
            },

            /**
             * Очистить объект audio (на всякий случай, чтобы память не текла)
             * @returns {_clearAudio}
             * @private
             */
            _clearAudio: function() {
                if (this.audio) {
                    this.audio.pause();
                    $(this.audio).remove();
                    this.audio = null;
                }
                return this;
            }


        }, {
            live: function() {
                this
                    .liveBindTo('line', 'pointerclick', function(e) {
                        this.tts.speak($(e.currentTarget).text(),  {
                            dataCallback: function (blob) {

                                this._clearAudio();

                                var url = URL.createObjectURL(blob);
                                this.audio =  new Audio(url);
                                this.audio.play();
                            }.bind(this)
                        });
                    })
                    .liveBindTo('button-instruction', 'pointerclick', function(e) {
                        this._onInstructionButtonClick(e);
                    })
                    .liveBindTo('button-save', 'pointerclick', function (e) {
                        this._save();
                    });

                return false;
            }
        }
        ));
    }
);
