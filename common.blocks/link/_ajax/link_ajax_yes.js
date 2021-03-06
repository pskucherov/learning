modules.define(
    'link',
    ['i-bem__dom', 'dom', 'jquery', 'BEMHTML'],
    function(provide, Link, dom, $, BEMHTML) {

        provide(Link.decl({ block: 'link', modName: 'ajax', modVal: 'yes' }, {

            js: {
                inited: function () {
                    this.waitRequest = false;
                }
            },
            _onPointerClick : function(e) {

                if (!history) {
                    return true;
                }

                e.preventDefault();

                if (this.waitRequest) {
                    return;
                }

                if (this.hasMod('ajax', 'yes')) {

                    this.waitRequest = true;
                    Link.blocks['page'].setContent(BEMHTML.apply({
                        block: 'spin',
                        mods: {
                            theme: 'islands', size: 'xl', visible: true
                        }
                    }));

                    this._get()
                        .success(function(data) {
                            this.waitRequest = false;
                            history.pushState('', '', this._url);

                            Link.blocks['page'].setContent(
                                typeof data === 'string'
                                    ? data
                                    : BEMHTML.apply(data)
                            );
                        }.bind(this))
                        .error(this._onError.bind(this));

                }

                this.__base.apply(this, arguments);
            },

            _get: function() {
                return $.get(this._url, { ajax: 'yes' }, { dataType: 'json' });
            },

            _onError: function() {

                this.waitRequest = false;
                console.log('ajax error');
                window.location.href = this._url;

            }


        }));

    }
);
