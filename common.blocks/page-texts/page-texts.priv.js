BEMPRIV.decl('page-texts', {
    init: function() {
        this.js(true);

        this.content([
            {
                block: 'page-texts',
                elem: 'title',
                content: 'Добавить статью'
            },
            {
                block: 'input',
                mods: {
                    theme: 'islands',
                    size: 'l'
                },
                name: 'title',
                placeholder: 'Заголовок'
            },

            {
                block: 'input',
                mods: {
                    theme: 'islands',
                    size: 'l'
                },
                name: 'description',
                placeholder: 'Описание'
            },

            {
                block: 'input',
                mods: {
                    theme: 'islands',
                    size: 'l'
                },
                name: 'keywords',
                placeholder: 'Ключевые слова'
            },

            {
                block: 'textarea'
            },
            {
                block: 'button',
                mods: {
                    theme: 'islands',
                    size: 'l'
                },
                text: 'Отправить на модерацию'
            }
        ]);
    }
});