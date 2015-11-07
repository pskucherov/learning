BEMPRIV.decl('header', {

    init: function() {

        this.content([
            {
                elem: 'logo'
            },
            BEMPRIV.create('user', this.data).json(),

            /*
            Пока без класса, только прокачка
            this.data.user.isAuth ? {
                elem: 'class',
                content: this.data.user.class + ' класс'
            } : ''
            */
        ]);

    }

}, {
    // static
});
