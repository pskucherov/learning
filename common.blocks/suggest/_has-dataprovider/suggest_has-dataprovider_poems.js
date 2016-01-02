modules.define(
    'suggest',
    ['poems-provider'],
    function(provide, TzDataProvider, Suggest) {

provide(Suggest.decl({ modName : 'has-dataprovider', modVal : 'poems' }, {

    onSetMod: {
        'js': {
            'inited': function () {

                this.__base.apply(this, arguments);

                // Костыль, чтобы сделать debounce
                this._input.un('change', this._onInputChange, this);
                this._input.on('change', _.debounce(this._onInputChange.bind(this), 500), this);

            }
        },

        'focused' : {
            '': function () {
                this.__base.apply(this, arguments);
                this._hideSpin();
            }
        }
    },



    /** @override */
    _createDataProvider : function() {
        return new TzDataProvider(this.params.data);
    },

    _onInputChange : function(e) {
        this.__base.apply(this, arguments);

        if (!_.isEmpty(this._input.getVal())) {
            this._input.setMod(this._input.elem('spin'), 'visible', true);
        }
    },

    _onMenuGotItems: function(e, data) {
        this._hideSpin();

        return this.__base.apply(this, arguments);
    },

    _hideSpin: function() {
        this._input.delMod(this._input.elem('spin'), 'visible');
        return this;
    }


}));

});
