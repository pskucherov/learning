modules.define(
    's-brain',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: function() {


                    console.log('s - brain - js');

                    //this.board = this.findBlockInside('blackboard');
                    //this.trigger('changeTitle');

                    window.socket.on('s-brain:question', function (data) {
                        if (_.isEmpty(data)) {
                            this._clearBoard();
                            return;
                        }

                        console.log(data);
                        this
                            ._setTitle(data.subj.name + ', ' + data.class + ' класс')
                            ._setQuestion(data.question)
                            ._setAnswers(this._parseAnswers(data.answers));
                    }.bind(this));

                }
            },

            _clearBoard: function() {
                this
                    ._setTitle('')
                    ._setQuestion('');
            },

            /**
             * Установить заголовок
             * @param title {String}
             * @returns {*}
             */
            _setTitle: function(title) {
                this.elem('title').html(title);
                return this;
            },

            /**
             *
             * @param answers {String}
             * @returns {Array}
             * @private
             */
            _parseAnswers: function(answers) {
                return answers.split('||');
            },

            /**
             * Установить вопрос
             * @param question {Array}
             * @returns {*}
             */
            _setQuestion: function(question) {
                this.elem('question').html(question);
                return this;
            },


            /**
             * Установить вопрос
             * @param answers {Array}
             * @returns {*}
             */
            _setAnswers: function(answers) {
                var bemJson = answers.map(function(answer, i) {
                    return {
                        block: 's-brain',
                        elem: 'answer',
                        mods: {
                            num: i
                        },
                        content: answer
                    }
                });

                this.elem('answers').html(BEMHTML.apply(bemJson));
                return this;
            },

            /**
             * При наведении на статус - показываем,
             * предварительно скрыв все попапы.
             * При клике на статус переключаем видимость попапа.
             *
             * @param e
             * @param num
             * @returns {_onPointerClick}
             * @private
             */
            _onPointerClick: function(e, num) {
                var popup = this.popups[num];

                if (_.isEmpty(popup) || (e.toElement && _.get(e, 'toElement.className') !== 'image')) {
                    return this;
                }

                if (popup.getMod('visible') && e.type === 'pointerclick') {
                    popup.setMod('visible', false);
                } else {
                    this._hidePopups();
                    popup.setAnchor(this.elem('status' + num));
                    popup.setMod('visible', true);
                }


                return this;
            }

        }, {
            live: function() {

                this.liveBindTo('status', 'mouseout', function() {
                    timer = setTimeout(function() {
                        this._hidePopups();
                    }.bind(this), 250);
                });

                return false;
            }
        }));
    }
);
