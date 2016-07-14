BEMPRIV.decl('s-math-tasks', {
    init: function() {

        this.js(true);

        this.content([
            'Hello, Math!',
            {
                block: 'page',
                elem: 'js',
                url: 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML'
            }
        ]);

    }
});
