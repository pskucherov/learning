BEMPRIV.decl('s-warden', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-warden',
                elem: 'column',
                title: 'Управление',
                items: [
                    {
                        name: 'addAuthor',
                        text: 'Добавить автора',
                        mod: 'author',
                        added: 0,
                        moderation: 0,
                        rejected: 0
                    },
                    {
                        name: 'addComposition',
                        text: 'Добавить произведение',
                        added: 0,
                        mod: 'composition',
                        moderation: 0,
                        rejected: 0
                    }
                ]
            },
            {
                block: 'modal',
                mods: { theme : 'islands', autoclosable: true, add: 'author' },
                content: {
                    block: 's-warden',
                    elem: 'add-author'
                }
            },
            {
                block: 'modal',
                mods: { theme : 'islands', autoclosable: true, add: 'composition' },
                content: {
                    block: 's-warden',
                    elem: 'add-composition',
                    content: 'aaa composition'
                }
            }
        ]);

    }
});
