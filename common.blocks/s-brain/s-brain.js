modules.define(
    's-brain',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {

                    this._clearBoard();
                    this._answerNum = false;

                    /**
                     *  Получает новый вопрос и добавляет его на доску
                     */
                    window.socket.on('s-brain:question', function (data) {

                        this._clearBoard();

                        if (_.isEmpty(data)) {
                            return;
                        }

                        this
                            ._setTitle(data.subj.name + ', ' + data.class + ' класс')
                            ._setQuestionId(data.id)
                            ._setQuestion(data.question)
                            ._setAnswers(data.answers);
                    }.bind(this));

                    /**
                     * Получение данных от сервера,
                     * это был правильный ответ на вопрос или нет.
                     *
                     * @params {Boolean} isRight
                     */
                    window.socket.on('s-brain:setAnswer', _.debounce(function(isRight) {
                        var answer = this._getSelectedAnswerElem();

                        if (_.isEmpty(answer)) {
                            return;
                        }

                        this.setMod(answer, 'is', isRight ? 'right' : 'false');
                    }.bind(this), 1000, {
                        'leading': true,
                        'trailing': false
                    }));


                }
            },

            _clearBoard: function() {

                this.currentQuestionId = 0;
                this._answerNum = false;

                this
                    ._setTitle('')
                    ._setQuestion(BEMHTML.apply({
                        block: 'spin',
                        mods: {
                            theme: 'islands', size: 'xl', visible: true
                        }
                    }))
                    ._setAnswers('');

                return this;

            },

            /**
             * Устанавливает id текущего вопроса
             *
             * @param {Number} id
             * @returns {_setQuestionId}
             * @private
             */
            _setQuestionId: function(id) {
                this.currentQuestionId = id;
                return this;
            },

            /**
             * Установить заголовок
             * @param title {String}
             * @returns {*}
             */
            _setTitle: function(title) {
                this.findElem('title').html(title);
                return this;
            },

            /**
             *
             * @param answers {String}
             * @returns {Array}
             * @private
             */
            _parseAnswers: function(answers) {
                var bemJson = answers.split('||').map(function(answer, i) {
                    return {
                        block: 's-brain',
                        elem: 'answer',
                        mods: {
                            num: i
                        },
                        content: answer
                    }
                });

                return BEMHTML.apply(bemJson);
            },

            /**
             * Установить вопрос
             * @param question {Array}
             * @returns {*}
             */
            _setQuestion: function(question) {
                this.findElem('question').html(question);
                return this;
            },


            /**
             * Установить вопрос
             * @param answers {Array}
             * @returns {*}
             */
            _setAnswers: function(answers) {
                this.findElem('answers').html(answers ? this._parseAnswers(answers) : '');
                return this;
            },

            /**
             * При наведении на статус - показываем,
             * предварительно скрыв все попапы.
             * При клике на статус переключаем видимость попапа.
             *
             * @param e
             * @param num
             * @returns {_onAnswerClick}
             * @private
             */
            _onAnswerClick: function(e) {
                if (Boolean(this._answerNum)) {
                    return this;
                }

                this._answerNum = this.getMod(e.currentTarget, 'num');

                this
                    ._freezeAnser()
                    ._checkAnswer(this._answerNum);

                return this;
            },

            /**
             * Зафризить ответ, чтобы его было нельзя поменять.
             *
             * @returns {_freezeAnser}
             * @private
             */
            _freezeAnser: function() {
                var answers = this.findElem('answer');

                this
                    .setMod(answers, 'freeze', 'yes')
                    .setMod(this._getSelectedAnswerElem(), 'selected', 'yes');

                return this;
            },

            /**
             * Получить элемент выбранного ответа
             * @returns {*}
             * @private
             */
            _getSelectedAnswerElem: function() {
                return Boolean(this._answerNum) ? this.findElem('answer', 'num', this._answerNum) : null;
            },

            /**
             * Отправляет на сервер данные об ответе
             *
             * @param {Number} num - номер ответа
             * @returns {_checkAnswer}
             * @private
             */
            _checkAnswer: function(num) {

                var num = parseInt(num, 10);

                window.socket.emit('s-braint:checkAnswer', {
                    id: this.currentQuestionId,
                    num: typeof num === 'number' ? num : -1
                });

                return this;

            },

            /**
             * Получить следующий вопрос
             *
             * @returns {_onNextButtonClick}
             * @private
             */
            _onNextButtonClick: function() {
                this._clearBoard();
                window.socket.emit('s-braint:nextQuestion');
                return this;
            }

        }, {
            live: function() {

                this
                    .liveBindTo('answer', 'pointerclick', function(e) {
                        this._onAnswerClick(e);
                    })
                    .liveBindTo('next-question', 'pointerclick', function(e) {
                        this._onNextButtonClick(e);
                    })
                    .liveInitOnBlockInsideEvent('change', 'class-select', function() {
                        this._clearBoard();
                    });

                return false;
            }
        }));
    }
);
