BEMPRIV.decl('exit', {
    init: function() {
        this.content({
            block: 'page',
            elem: 'js',
            content: 'location.href = \'/\''
        });
    }
});
