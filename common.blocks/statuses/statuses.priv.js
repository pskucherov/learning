BEMPRIV.decl('statuses', {

}, {
    /**
     * Получить возможные статусы, которые можно заработать на сайте.
     *
     * @returns {Object}
     */
    getList: function() {
        var p = 'data:image/png;base64,';
        return [
            {
                name: 's-brain',
                m: { name: 'Умник', img: p + 'borschik:include:./botan15_b.png' },
                f: { name: 'Умничка', img: p + 'borschik:include:./botan15_b.png' },
                descr: 'Необходимо использовать свои знания для того, чтобы отвечать на вопросы, ' +
                    'распутывать головоломки и решать задачи. ' +
                    'Чем больше ты дашь правильных ответов, тем выше твой рейтинг.',
                defVal: 60
            },
            /* {
                name: 's-cool',
                m: { name: 'Крутой', img: p + 'borschik:include:./gangster14_b.png' },
                f: { name: 'Крутышка', img: p + 'borschik:include:./koroleva12_b.png' },
                descr: 'Чтобы повысить свой рейтинг, ты должен пользоваться популярностью. ' +
                    'Твою анкету должны часто просматривать и комментировать. ' +
                    'Чем больше у тебя будет оценок и внимания, тем выше твой рейтинг.',
                defVal: 76
            },
            {
                name: 's-winner',
                m: { name: 'Победитель', img: p + 'borschik:include:./boltun_b.png' },
                f: { name: 'Победительница', img: p + 'borschik:include:./boltun_b.png' },
                descr: 'Всё просто — ты должен побеждать. На сайте представлено множество игр и соревнований, ' +
                    'в котором нужно быть первым, быть лучшим, чем больше у тебя будет побед, тем выше твой рейтинг.',
                defVal: 24
            },
            {
                name: 's-warden',
                m: { name: 'Староста', img: p + 'borschik:include:./starosta4_b.png' },
                f: { name: 'Староста', img: p + 'borschik:include:./starosta5_b.png' },
                descr: 'Помогай другим учиться, выкладывай домашки, заполняй дневник, проверяй домашние работы.' +
                    'Чем больше ты будешь правильно выполнять обязанности учителя,' +
                    'пока его нет в классе — тем выше твой рейтинг',
                defVal: 90
            } */
        ];
    },
    listLength: 3
});
