modules.define(
    'page',
    ['i-bem__dom', 'jquery'],
    function(provide, Page, $) {

        provide(Page.decl('page', {
            onSetMod: {

                'js': {
                    'inited': function () {

                        this._htmlBody = $('html, body');

                        this
                            .findBlocks()
                            ._getCurrentHash()
                            ._syncState()
                            ._scrollTo(this._currentHash, 0)
                            .bindEvents();

                    }
                }

            },

            /**
             * Получить текущий hash
             * @returns {*}
             * @private
             */
            _getCurrentHash: function() {
                this._currentHash = window.location.hash && window.location.hash.substring(1) || this.landing.getFirstHash();
                return this;
            },

            /**
             * Сохранить переданный hash
             * @param {String} hash
             * @returns {*}
             * @private
             */
            _setCurrentHash: function(hash) {
                this._currentHash = hash;
                return this;
            },

            /**
             * Синхронизировать размеры окна и слайдов
             * @returns {*}
             * @private
             */
            _syncState: function() {
                this._pageHeight = this._getPageHeight();
                this.landing.setHeightToWrapper(this._pageHeight);
                return this;
            },

            findBlocks: function() {
                this.landing = this.findBlockInside('landing');
                return this;
            },

            bindEvents: function() {

                this._throttleScroll = _.throttle(this._animateScrollByEvent.bind(this), 1100, { trailing: false });

                this.bindToWin('resize', _.throttle(function() {
                    this._pageHeight = this._getPageHeight();
                    this._syncState();
                    this._scrollTo(this._currentHash, 0);
                }, 100, this));

                this.bindToWin('mousewheel DOMMouseScroll keyup', function(e) {

                    e.preventDefault();
                    e.stopImmediatePropagation();

                    // Если нажата клавиша, то скроллим без ожидания
                    if (e.originalEvent.keyCode) {
                        this._animateScrollByEvent(e);
                    }  else {
                        this._throttleScroll(e);
                    }

                }, this);

                return this;
            },

            /**
             * Понять направление события скролла и выполнить анимированное подскролливание.
             *
             * @param {Event} e - событие скролла или нажатия клавиши.
             * @private
             */
            _animateScrollByEvent: function(e) {

                var event = e.originalEvent;

                if (event.keyCode) {
                    switch(event.keyCode) {
                        case 37:
                        case 38:
                            delta = -1;
                            break;
                        case 39:
                        case 40:
                            delta = 1;
                    }
                } else {
                    delta = event.deltaY || event.detail;
                }

                if (delta) {

                    var slide = delta <= 0 ?
                        Page.blocks['landing'].getPrevSlide(this._currentHash)  :
                        Page.blocks['landing'].getNextSlide(this._currentHash);

                    !_.isEmpty(slide) && this._scrollTo(slide.attr('id'));

                }

                return this;
            },

            /**
             * Подскролливаем к заданному элементу.
             *
             * @param {String} hash - id элемента, к которому надо подскроллить
             * @param {Number} [delay=350] - время анимации подскралливиния.
             * @returns {*}
             * @private
             */
            _scrollTo: function(hash, delay) {

                if (typeof delay === 'undefined') {
                    delay = 350;
                }

                if (this._animate) {
                    return;
                }
                this._animate = true;

                this._setCurrentHash(hash);

                this._htmlBody.stop().animate({

                    scrollTop: $('#' + hash).offset().top - $('.header').height() - 20

                }, delay, function() {
                    this._animate = false;
                    window.location.hash = '#' + this._currentHash;
                }.bind(this));

                return this;
            },

            /**
             * Рассчитываем высоту каждого слайда
             *
             * @returns {number}
             * @private
             */
            _getPageHeight: function() {
                return $(window).height() - $('.header').height();
            }

        }));

    }

);
