modules.define(
    'link',
    ['i-bem__dom', 'dom', 'jquery'],
    function(provide, Link, dom, $) {

        provide(Link.decl({ block: 'link', modName: 'ajax', modVal: 'yes' }, {

            js: {
                inited: function () {

                }
            },
            _onPointerClick : function(e) {

                if (!history) {
                    return true;
                }

                e.preventDefault();


                if (this.hasMod('ajax', 'yes')) {

                    this._get()
                        .success(function(data) {
                            history.pushState(data, '', this._url);
                            Link.blocks['page'].setContent(data);
                        }.bind(this))
                        .error(this._onError.bind(this));

                }

                this.__base.apply(this, arguments);
            },

            _get: function() {

                return $.get(this._url, { ajax: 'yes' });

            },

            _onError: function() {

                console.log('ajax error');
                window.location.href = this._url;

            }


        }));

    }
);
