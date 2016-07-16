BEMPRIV.decl('s-math-tasks', {
    init: function() {
        this.js(true);

        this.content([
            this._getMathLib()
        ]);
    },

    /**
     * Добавить библиотеку для работы с формулами
     *
     * @returns {{block: string, elem: string, url: string}}
     * @private
     */
    _getMathLib: function() {
        return {
            block: 'page',
            elem: 'js',
            url: 'https://cdn.mathjax.org/mathjax/latest/MathJax.js?config=TeX-MML-AM_CHTML'
        };
    }
});
