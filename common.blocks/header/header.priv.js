BEMPRIV.decl('header', {

    init: function() {

        this.content([
            {
                elem: 'logo'
            },

            BEMPRIV.create('user', this.data).json()
        ]);

    }

}, {
    // static
});
