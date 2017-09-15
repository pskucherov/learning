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
                name: 'page-search',
                m: { name: 'Сыщик', img: '/images/search.png' },
                f: { name: 'Сыщица', img: '/images/search.png' },
                url: '/search',
                descr: 'Необходимо находить информацию, которая тебя интересует, либо помогать другим находить то, что они ищут. ' +
                    'Чем больше найдено полезной информации для себя и других, тем выше рейтинг.',
                defVal: 96
            },
            {
                name: 's-brain',
                m: { name: 'Умник', img: p + 'borschik:include:./botan15_b.png' },
                f: { name: 'Умничка', img: p + 'borschik:include:./botan15_b.png' },
                url: '/',
                descr: 'Необходимо использовать свои знания для того, чтобы отвечать на вопросы, ' +
                    'распутывать головоломки и решать задачи. ' +
                    'Чем больше правильно отвечаешь на вопросы, тем выше рейтинг.',
                defVal: 60
            },
            {
                name: 's-speaker',
                m: { name: 'Оратор', img: p + 'borschik:include:./boltun_b.png' },
                f: { name: 'Оратор', img: p + 'borschik:include:./boltun_b.png' },
                url: '/speaker',
                descr: 'Необходимо изучать стихотворения, уметь быстро и внятно читать. ' +
                    'Чем больше читаешь, изучаешь, пересказываешь, тем выше рейтинг.',
                defVal: 86
            },
            /*
            Выпилил раздел, так как он не интересен в техническом плане
            {
                name: 's-consultor',
                m: { name: 'Советчик', img: p + 'borschik:include:./lernt2_b.png' },
                f: { name: 'Советчица', img: p + 'borschik:include:./lernt2_b.png' },
                url: '/consultor',
                descr: 'Необходимо задавать вопросы и давать советы. ' +
                    'Вопросы и советы, которые наберут больше всего лайков в течение дня — ' +
                    'будут размещены на доске почёта.',
                defVal: 40
            }
            */
            /*,
            {
                name: 's-warden',
                m: { name: 'Староста', img: p + 'borschik:include:./starosta4_b.png' },
                f: { name: 'Староста', img: p + 'borschik:include:./starosta5_b.png' },
                url: '/warden',
                descr: 'Помогай другим учиться, выкладывай домашки, заполняй дневник, проверяй домашние работы.' +
                    'Чем больше будешь выполнять обязанности учителя,' +
                    'пока его нет в классе — тем выше твой рейтинг.',
                defVal: 40
            }
            /* {
                name: 's-cool',
                m: { name: 'Крутой', img: p + 'borschik:include:./gangster14_b.png' },
                f: { name: 'Крутышка', img: p + 'borschik:include:./koroleva12_b.png' },
                descr: 'Чтобы повысить свой рейтинг, ты должен пользоваться популярностью. ' +
                    'Твою анкету должны часто просматривать и комментировать. ' +
                    'Чем больше у тебя будет оценок и внимания, тем выше твой рейтинг.',
                defVal: 76
            },
            */
        ];
    },
    listLength: 3
});
