BEMPRIV.decl({ block: 'rating', modName: 's-brain', modVal: 'yes' }, {
    init: function() {
        this.mods({ 's-brain': 'yes' });
        this.__base.apply(this, arguments);
    }
});
