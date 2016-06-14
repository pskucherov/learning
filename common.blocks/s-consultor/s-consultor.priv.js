BEMPRIV.decl('s-consultor', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-consultor',
                elem: 'show-popup-button',
                js: { add: 'question' },
                content: {
                    block: 'button',
                    mods: { theme: 'islands', size: 'l' },
                    text: 'Задать вопрос'
                }
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
