BEMPRIV.decl('s-speaker', {
    init: function() {

        /**
         * Модификаторы для меню, на который матчатся события
         * @type {{0: string, 1: string, 2: string, 3: string, 4: string, 5: string}}
         */
        var LINE_ACTION_MOD = [
            'select-poem',
            'read',
            'select-images',
            'sort-lines',
            'repeat-poem',
            'finish'
        ];

        this.js(true);

        this.content([
            {
                block: 's-speaker',
                elem: 'how-quickly-learn',
                content: [
                    {
                        block: 's-speaker',
                        elem: 'title',
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
                                    mods: { disabled: 'yes', act: LINE_ACTION_MOD[k] },
                                    mix: { block: 's-speaker', elem: 'checkbox' }
                                },
                                {
                                    elem: 'line',
                                    attrs: { style: k ? '' : 'margin-top: 0;' },
                                    mods: { disabled: k ? 'yes' : '', act: LINE_ACTION_MOD[k] },
                                    content: item
                                },
                                {
                                    tag: 'br'
                                }
                            ];
                        })
                    },
                    {
                        block: 'modal',
                        mods: { theme : 'islands', autoclosable: true, modal: 'index' },
                        content: ''
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
