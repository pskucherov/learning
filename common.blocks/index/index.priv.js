BEMPRIV.decl('index', {
    init: function() {

        this.content(
            !this.data.user.isAuth && BEMPRIV.create('landing', this.data).json() || ''
        );

    }
});
