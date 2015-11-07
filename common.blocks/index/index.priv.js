BEMPRIV.decl('index', {
    init: function() {

        this.content(
            this.data.user.isAuth
                ? BEMPRIV.create('s-brain', this.data).json()
                : BEMPRIV.create('landing', this.data).json()
        );

    }
});
