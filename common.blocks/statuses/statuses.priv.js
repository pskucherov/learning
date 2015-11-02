BEMPRIV.decl('statuses', {

}, {
    /**
     * Получить возможные статусы, которые можно заработать на сайте.
     *
     * @returns {Object}
     */
    getList: function() {
        var p = 'data:image/png;base64,';
        return {
            0: {
                m: { name: 'Умник', img: p + 'borschik:include:./botan15_b.png' },
                f: { name: 'Умничка', img: p + 'borschik:include:./botan15_b.png' }
            },
            1: {
                m: { name: 'Крутой', img: p + 'borschik:include:./gangster14_b.png' },
                f: { name: 'Крутышка', img: p + 'borschik:include:./koroleva12_b.png' }
            },
            2: {
                m: { name: 'Победитель', img: p + 'borschik:include:./boltun_b.png' },
                f: { name: 'Победительница', img: p + 'borschik:include:./boltun_b.png' }
            },
            3: {
                m: { name: 'Староста', img: p + 'borschik:include:./starosta4_b.png' },
                f: { name: 'Староста', img: p + 'borschik:include:./starosta5_b.png' }
            }
        };
    }
});
