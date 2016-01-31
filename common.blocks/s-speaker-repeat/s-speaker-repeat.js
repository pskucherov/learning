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
                        this.poem = null;

                        this.speakButton = this.findBlockInside({ block: 'button', modName: 'speak', modVal: true });

                        this.tts = ya.speechkit.Tts({
                            speaker: 'jane',
                            emotion: 'mixed',
                            gender: 'female',
                            speed: 0.8,
                            apiKey: 'ee18d8a0-5813-4657-9469-972ba94af634'
                        });

                        this.recognize = new ya.speechkit.SpeechRecognition();

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
                    ._clearAudio()
                    ._stopLearning();

                delete this.bm;

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

                this.bm = new BM25();

                this.poem = poem[0];

                this.poem.poem.forEach(function(item) {
                    this.bm.addDocument({ id: item.line_num, body: item.line });
                }.bind(this));

                BEMDOM.update(this.elem('poem'), BEMHTML.apply({
                    block: 's-speaker-repeat',
                    elem: 'poem',
                    title: this.poem.name,
                    author: this.poem.author.name,
                    poem: this.poem.poem
                }));

                /*
                //воспроизведение текста

                */

            },

            /**
             * Воспроизвести стих целиком
             * @returns {_speakPoem}
             * @private
             */
            _speakPoem: function() {
                var text = '';

                if (this.poem) {
                    this.poem.poem.forEach(function(item) {
                        text += item.line + ', ';
                    });
                    this._speak(text);
                }

                return this;
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
                if (this._isAudioInProcess()) {
                    this.speakButton.setMod('checked', false);
                    this.audio.pause();
                    $(this.audio).remove();
                    this.audio = null;
                }
                return this;
            },

            /**
             * Проверка на то, что аудио воспроизводится.
             * @returns {Boolean}
             * @private
             */
            _isAudioInProcess: function() {
                return !!this.audio;
            },

            /**
             * TODO: порефакторить и вынести воспроизведение в отдельный блок
             * Воспроизвести текст
             * @param text
             * @param {Function} onEnd
             * @private
             */
            _speak: function(text, onEnd) {

                this.speakButton.setMod('checked', true);

                this.tts.speak(text,
                    {
                        dataCallback: function (blob) {
                            this._clearAudio();
                            var url = URL.createObjectURL(blob);
                            this.audio = new Audio(url);
                            this.audio.play();
                            this.audio.onended = function() {
                                this.speakButton.setMod('checked', false);
                                this._clearAudio();
                                onEnd && onEnd();
                            }.bind(this)
                        }.bind(this)
                    }
                );

            },

            /**
             * Скрыть инструкцию
             *
             * @returns {_closeInstruction}
             * @private
             */
            _closeInstruction: function() {
                this
                    .setMod(this.elem('instruction'), 'hidden', true)
                    .delMod(this.elem('poem'), 'hidden');

                this.findBlockInside({ block: 'button', modName: 'instruction', modVal: true }).delMod('checked');
                return this;
            },

            _stopLearning: function() {
                this.findBlockInside({ block: 'button', modName: 'recognition', modVal: true }).delMod('checked');
                this.recognize.stop();
                delete this.recognize;
                return this;
            },

            _startLearning: function() {

                this.recognize = new ya.speechkit.SpeechRecognition();

                this.currentLine = 0;
                this.uttrCount = 0;

                var options = {
                        resultCallBackBuf: function (text) {
                            if (!text) {
                                return;
                            }
                            var num = this.bm.search(text);

                            if (typeof num === 'number' && num >= 0) {
                                this.currentLine = num;
                            }

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
                    },
                    opts = ya.speechkit._extend(
                    ya.speechkit._extend(
                        {},
                        ya.speechkit._defaultOptions()
                    ),
                    options);

                opts.doneCallback = options.doneCallback;

                opts.dataCallback = function (text, uttr, merge) {


                    var line;
                    console.log('text');
                    console.log(arguments);

                    opts.resultCallBackBuf(text);

                    if (uttr) {
                        this.uttrCount++;
                        if (this.uttrCount > 20) {
                            this._stopLearning();
                        } else {

                            this._stopLearning();

                            if (opts.doneCallback) {
                                opts.doneCallback(text);
                            }

                            line = this.poem.poem[this.currentLine + 1];
                            if (line && !_.isEmpty(line.line)) {
                                this._speak(line.line, this._startLearning.bind(this));
                            } else {
                                this.findBlockInside({ block: 'button', modName: 'button-save', modVal: true }).setMod('view', 'action');
                            }
                        }
                        //dict.stop();
                    }
                }.bind(this);

                opts.stopCallback = function () {
                    dict = null;
                };

                this.recognize.start(opts);

                return this;
            }

        }, {
            live: function() {
                this
                    .liveBindTo('line', 'pointerclick', function(e) {
                        this._speak($(e.currentTarget).text());
                    })
                    .liveBindTo('button-instruction', 'pointerclick', function(e) {
                        this._onInstructionButtonClick(e);
                    })
                    .liveBindTo('button-recognition', 'pointerclick', function(e) {

                        if (this.recognize && this.recognize.send) {
                            this._stopLearning();
                        } else {
                            this
                                ._closeInstruction()
                                ._clearAudio()
                                ._startLearning();
                        }
                    })
                    .liveBindTo('button-speak', 'pointerclick', function(e) {
                        this._closeInstruction();
                        if (this._isAudioInProcess()) {
                            this._clearAudio();
                        } else {
                            this._speakPoem();
                        }
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
