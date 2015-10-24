BEMPRIV.decl('header', {

    init: function() {

        this.content([
            {
                elem: 'logo'
            },
            BEMPRIV.create('vk', this.data).json()
        ]);

    }

}, {
    // static
});
