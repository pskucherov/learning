BEMPRIV.decl('second-page', {
    init: function() {

        this.content({

            block: 'link',
            mods: { ajax: 'yes' },
            url: '/tpage/',
            content: 'got to third-page content'

        });

    }
});
