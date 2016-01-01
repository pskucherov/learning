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
                        content: 'Быстро и увлекательно учим стихи'
                    },
                    {
                        tag: 'br'
                    },
                    {
                        content: [
                            'Выберите стихотворение',
                            'Прочитайте и запомните содержание',
                            'Подберите картинки, которые напоминают каждый куплет',
                            'Расставьте строки в правильном порядке',
                            'Расскажите стих, следуя подсказкам',
                            'Повторяйте пункты 4 и 5, пока не запомните стихотворение'
                        ].map(function (item, k) {
                            return [
                                {
                                    block: 'checkbox',
                                    mods: { disabled: 'yes' },
                                    mix: { block: 's-speaker', elem: 'checkbox' }
                                },
                                {
                                    elem: 'line',
                                    attrs: { style: k ? '' : 'margin-top: 0;' },
                                    mods: { disabled: k ? 'yes' : '' },
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
