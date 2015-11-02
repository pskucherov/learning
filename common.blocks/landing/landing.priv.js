BEMPRIV.decl('landing', {

    init: function() {
        this.js(true);

        this.content([
            { elem: 'title' },
            {
                elem: 'status',
                statuses: BEMPRIV.block('statuses').getList()
            },
            {
                elem: 'footer',
                vkAuth: BEMPRIV.create({ block: 'vk', mods: { link: 'auth' }}, this.data).json()
            }
        ]);
    },

}, {

});
