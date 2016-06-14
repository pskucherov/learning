BEMPRIV.decl('s-consultor', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-consultor'
            },
            {
                block: 'modal',
                mods: { theme : 'islands', autoclosable: true, add: 'question' },
                content: {
                    block: 's-consultor',
                    elem: 'add-question'
                }
            }
        ]);

    }
});
