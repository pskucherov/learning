BEMPRIV.decl('third-page', {
    init: function() {
        this.content({

            block: 'link',
            mods: { ajax: 'yes' },
            url: '/spage/',
            content: 'got to second-page content'

        });
    }
});
