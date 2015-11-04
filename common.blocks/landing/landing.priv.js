BEMPRIV.decl('landing', {

    init: function() {
        this.js(true);

        this.content([
            {
                elem: 'title',
                isFemale: this.data.isFemale
            },
            {
                elem: 'status',
                isFemale: this.data.isFemale,
                statuses: BEMPRIV.block('statuses').getList()
            },
            //BEMPRIV.create('vk', this.data).initOpenApi().content('Начать').json(),
            {
                elem: 'footer',
                content: BEMPRIV.create('vk', this.data).json()
            }
        ]);
    }

}, {

});
