BEMPRIV.decl('s-consultor', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-consultor',
                elem: 'show-popup-button',
                js: { add: 's-consultor-question' },
                content: {
                    block: 'button',
                    mods: { theme: 'islands', size: 'l' },
                    text: 'Задать вопрос'
                }
            },
            {
                block: 'modal',
                mods: { theme : 'islands', //autoclosable: true,
                    add: 's-consultor-question' },
                mix: { block: 's-consultor', elem: 'modal' },
                content: [
                    {
                        block: 's-consultor',
                        elem: 'add-question',
                        content: {
                            block: 'textarea',
                            mods: {
                                theme: 'islands',
                                size: 'm'
                            },
                            mix: { block: 's-consultor', elem: 'textarea' },
                            placeholder: 'Введите свой вопрос'
                        }
                    },
                    {
                        block: 'button',
                        mods: { theme: 'islands', size: 'l' },
                        mix: { block: 's-consultor', elem: 'send-question' },
                        text: 'Отправить на модерацию'
                    }
                ]
            }
        ]);

    }
});
