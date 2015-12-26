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
                        added: 0,
                        moderation: 0,
                        rejected: 0
                    },
                    {
                        name: 'addComposition',
                        text: 'Добавить произведение',
                        added: 0,
                        moderation: 0,
                        rejected: 0
                    }
                ]
            }
        ]);

    }
});
