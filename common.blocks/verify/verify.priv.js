BEMPRIV.decl('verify', {
    init: function() {

        this.content([
            /*{
                //elem: 'welcome-image'
            },*/
            {
                block: 'page',
                elem: 'css',
                content: '* { display: none !important; }'
            },
            {
                block: 'page',
                elem: 'js',
                content: 'window.checkAuthInfo = true;' +
                    'window.authInfo = function() {' +
                    "window.location.href = '" + (this.data.session.redirPage || '/') + "';" +
                    '};'
            },
            BEMPRIV.create('vk', this.data).json()
        ]);

    }
});
