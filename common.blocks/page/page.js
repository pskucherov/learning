modules.define(
    'page',
    ['i-bem__dom', 'jquery'],
    function(provide, Page, $) {

        provide(Page.decl('page', {
            onSetMod: {

                'js': {
                    'inited': function () {

                        this.findBlocks()
                            .bindEvents();

                        this._htmlBody = $('html, body');

                        this._syncState();

                    }
                }

            },

            _syncState: function() {
                this._lastScrollY = 0;
                this._pageHeight = this._getPageHeight();
                this.landing.setHeightToWrapper(this._pageHeight);
            },

            findBlocks: function() {
                this.landing = this.findBlockInside('landing');
                return this;
            },

            bindEvents: function() {

                this._throttleScroll = _.throttle(this._animateScroll, 500, { 'trailing': false });

                this.bindToWin('resize', _.debounce(function(e) {
                    this._pageHeight = this._getPageHeight();
                }, 150, this));


                this.bindToWin('scroll mousewheel DOMMouseScroll', function(e) {

                    e.preventDefault();
                    e.stopImmediatePropagation();

                    this._throttleScroll(e);

                }, this);

            },

            _animateScroll: function(e) {

                if (this._animate) {
                    return;
                }

                var wheelEvent = e.originalEvent,
                    delta = wheelEvent.deltaY || wheelEvent.detail;

                if (delta) {

                    this._animate = true;

                    this._htmlBody.stop().animate({

                        scrollTop: delta <= 0 ?
                            $(window).scrollTop() - this._pageHeight :
                            $(window).scrollTop() + this._pageHeight

                    }, 500, function() {
                        this._animate = false;
                    }.bind(this));

                }

            },

            _getPageHeight: function() {
                return $(window).height() - $('.header').height();
            }

        }));

    }

);
