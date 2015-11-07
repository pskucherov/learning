BEMPRIV.decl('landing', {

    init: function() {
        this.js(true);

        this.content([
            {
                elem: 'title',
                isFemale: this.data.isFemale
            },
            this.getStatuses(),
            //BEMPRIV.create('vk', this.data).initOpenApi().content('Начать').json(),
            {
                elem: 'footer',
                content: BEMPRIV.create('vk', this.data).json()
            }
        ]);
    },

    getStatuses: function(mods) {
        var content = {
            block: 'landing',
            mods: mods,
            elem: 'status',
            isFemale: this.data.isFemale,
            progress: this.data.user.isAuth ? JSON.parse(this.data.user.statuses || 1) : 0,
            statuses: BEMPRIV.block('statuses').getList()
        };

        return mods ? {
            block: 'landing',
            mods: mods,
            content: content
        } : content;
    }

}, {

});
