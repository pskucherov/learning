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
                        this.buttonSave = this.findBlockInside({ block: 'button', modName: 'button-save', modVal: true });

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

                // Делаем возможным перетаскивать строки в пределах попапа
                this.elem('line', 'draggable', true).draggable({
                    containment: '.s-speaker-sort-lines__poems',
                    stop: this._onStopDrag.bind(this)
                });

            },

            _onStopDrag: function() {
                if (this._isPoemReady()) {
                    this.buttonSave.delMod('disabled');
                } else {
                    this.buttonSave.setMod('disabled', true);
                }
            },

            /**
             * Проверяет все ли строки стоят на своих местах
             *
             * @returns {Boolean}
             * @private
             */
            _isPoemReady: function() {
                var linesPos = this._getSortedLinesPos();

                return _.every(this.elem('line', 'draggable', true), function(current) {
                    current = $(current);
                    var i = this.getMod(current, 'num');
                    return linesPos[i] === current.offset().top;
                }.bind(this));

            },

            /**
             * Отсортировать позиции строк в возрастающем порядке
             *
             * @returns {Array.<T>}
             * @private
             */
            _getSortedLinesPos: function() {
                var linesPos = [];

                _.forEach(this.elem('line', 'draggable', true), function(item) {
                    linesPos.push($(item).offset().top);
                }.bind(this));

                return linesPos.sort(function(a, b) {
                    return a - b;
                });
            },

            /**
             * Показать статус сортировки строк
             *
             * @returns {_checkLinesPos}
             * @private
             */
            _showSortStatus: function() {
                var linesPos = this._getSortedLinesPos();

                _.forEach(this.elem('line', 'draggable', true), function(current) {

                    current = $(current);

                    var i = this.getMod(current, 'num');

                    this
                        .delMod(current, 'wrong-pos')
                        .delMod(current, 'right-pos');

                    if (linesPos[i] !== current.offset().top) {
                        this.setMod(current, 'wrong-pos', true);
                    } else {
                        this.setMod(current, 'right-pos', true);
                    }

                }.bind(this));

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
            },

            _onHelpButtonClick: function(e) {

                this.helpButton
                    || (this.helpButton = this.findBlockInside({ block: 'button', modName: 'help', modVal: true }));

                this.delMod(this.elem('hidden-line'), 'no-help');

                this._showSortStatus();

                setTimeout(function() {
                    this.helpButton.delMod('checked');

                    this
                        .setMod(this.elem('hidden-line'), 'no-help', true)
                        .delMod(this.elem('line'), 'wrong-pos')
                        .delMod(this.elem('line'), 'right-pos');

                }.bind(this), 5000);

            }

        }, {
            live: function() {
                this
                    .liveBindTo('button-help', 'pointerclick', function (e) {
                        this._onHelpButtonClick();
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
