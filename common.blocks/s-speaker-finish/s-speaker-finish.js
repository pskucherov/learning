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
                        this.progress = null;

                        if (!_.isEmpty(this.currentPoemId)) {
                            this._toggleForm();
                            window.socket.emit('s-speaker-finish:get-progress', this.currentPoemId);
                        }

                        window.socket.on('s-speaker-finish:progress', function(progress) {
                            this._toggleForm();

                            this.progress = progress;
                            this._setDuration(progress.deltaTime);

                            window.socket.emit('select-poem:getPoemById', this.currentPoemId);

                            this.bindEvents();
                        }.bind(this));

                        window.socket.on('select-poem:getPoemById', function(poem) {
                            this._setShareButtons(poem);
                        }.bind(this));
                    }
                }
            },

            bindEvents: function() {

            },

            unbindEvents: function() {
                window.socket.removeAllListeners('select-poem:getPoemById');
                window.socket.removeAllListeners('s-speaker-finish:progress');
            },

            _destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
            },

            /**
             * Добавить поделяшку с нужным текстом
             * @param poem
             * @private
             */
            _setShareButtons: function(poem) {
                var title = 'Теперь я знаю стихотворение "' + poem.name + '" (' + poem.author.name + ')',
                    duration = BEMDOM.blocks['i-utils'].parseMicroseconds(this.progress.deltaTime),
                    descr = 'На изучение у меня ушло: ' + BEMHTML.apply({
                        block: 'spent-time',
                        duration: duration
                    }) + '. А за сколько этот стих выучишь ты? ;)';


                VK.Widgets.Like('vk_like', { width: 130, pageTitle: title + ' ' + descr, pageDescription: descr });

                /*
                VK.Observer.subscribe('widgets.like.unshared', function() {
                    console.log('unshared');
                });
                */

                VK.Observer.subscribe('widgets.like.shared', function() {
                    window.socket.emit('s-speaker-finish:save', {
                        poemId: this.currentPoemId,
                        act: 's-speaker-finish'
                    });
                }.bind(this));

                //BEMDOM.update(this.elem('vk-share-button'), BEMDOM.blocks['vk'].getShareButton(title, descr));
                return this;
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
