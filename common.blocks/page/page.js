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

                        this._lastScrollY = 0;
                        this._pageHeight = this._getPageHeight();

                        this._htmlBody = $('html, body');

                        this.landing.setHeightToWrapper(this._pageHeight);

                    }
                }

            },

            findBlocks: function() {
                this.landing = this.findBlockInside('landing');
                return this;
            },

            bindEvents: function() {

                this.bindToWin('resize', _.throttle(function(e) {
                    console.log(e)
                }, 200, this));

                this.bindToWin('scroll mousewheel DOMMouseScroll', function(e) {

                    e.preventDefault();

                    if (this._animate) {
                        return;
                    }

                    this._animate = true;

                    this._htmlBody.stop().animate({
                        scrollTop: e.currentTarget.scrollY - this._lastScrollY > 0 ?
                            -this._pageHeight :
                            this._pageHeight
                    }, 500, function() {
                        this._animate = false;
                        this._lastScrollY = e.currentTarget.scrollY;
                    }.bind(this));

                }, this);

            },

            _getPageHeight: function() {
                return $(window).height() - $('.header').height();
            }

        }));

    });
