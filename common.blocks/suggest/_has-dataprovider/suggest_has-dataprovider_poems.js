modules.define(
    'suggest',
    ['poems-provider', 'select-poem'],
    function(provide, TzDataProvider, selectPoem, Suggest) {

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

    /** @override */
    _onInputChange : function(e) {

        if (this.hasMod('focused') && !_.isEmpty(this._input.getVal())) {
            this._input.setMod(this._input.elem('spin'), 'visible', true);
            this._menu.requestData({
                val: e.target.getVal(),
                act: this.getMod('act')
            });
        }

        this.emit('change');
    },

    _onMenuItemClick : function(e, data) {
        this
            .delMod('focused')
            .setVal(data.item.getVal(), { source : 'datalist' })
            ._hideSpin();

        // TODO: этому здесь не место, т.к. блок может быть привязан к любому другому элементу
        selectPoem.getPoemIfExists();
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
