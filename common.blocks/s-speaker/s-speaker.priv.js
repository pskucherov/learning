BEMPRIV.decl('s-speaker', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-speaker',
                elem: 'how-quickly-learn',
                content: [
                    {
                        block: 's-speaker',
                        elem: 'poem-title',
                        content: 'Быстро выучить стих'
                    },
                    {
                        tag: 'br'
                    },
                    {
                        tag: 'ol',
                        content: [
                            'Выберите стих (если его нет, то добавьте, а затем выберите)',
                            'Прочитайте вслух несколько раз, запомните в целом содержание',
                            'Подберите картинки, которые напоминают каждый куплет',
                            'Поставьте строки в правильном порядке',
                            'Следуя подсказкам расскажите стих',
                            'Повторяйте пункты 4 и 5, пока не запомните стихотворение'
                        ].map(function (item) {
                            return [
                                {
                                    tag: 'li',
                                    elem: 'line',
                                    content: item
                                },
                                {
                                    tag: 'br'
                                }
                            ];
                        })
                    }
                ]
            }
            /*{
                block: 's-speaker',
                elem: 'poem-text'
            }
            /*,{
                block: 's-speaker',
                elem: 'visual-container',
                content: {
                    block: 's-speaker',
                    elem: 'visualisation'
                }
            }*/
        ]);

    }
});
