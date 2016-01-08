BEMPRIV.decl('s-speaker', {
    init: function() {

        /**
         * Модификаторы для меню, на который матчатся события
         * @type {{0: string, 1: string, 2: string, 3: string, 4: string, 5: string}}
         */
        var LINE_ACTION_MOD = [
                {
                    act: 'select-poem',
                    text: 'Выберите стихотворение'
                },
                {
                    act: 's-speaker-read',
                    text: 'Прочитайте и запомните содержание'
                },
                /*{
                    act: 'select-images',
                    text: 'Подберите картинки, которые напоминают каждый куплет'
                },*/
                {
                    act: 's-speaker-sort-lines',
                    text: 'Расставьте строки в правильном порядке'
                },
                {
                    act: 'repeat-poem',
                    text: 'Расскажите стих, следуя подсказкам'
                },
                /*{
                    act: 'repeat-steps',
                    text: 'Повторяйте пункты 4 и 5, пока не запомните стихотворение'
                },*/
                {
                    act: 'finish',
                    text: 'Поделитесь с друзьями своим успехом'
                }
            ],
            finishedSteps = _.get(this.data, 'res.speakerLearnPoem.complitedSteps', '').split(',');

        this.js({
            poemId: _.get(this.data, 'res.speakerLearnPoem.id', 0),
            steps: _.pluck(LINE_ACTION_MOD, 'act')
        });

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
                        content: _.map(LINE_ACTION_MOD, function (item, k) {
                            var prev = LINE_ACTION_MOD[k-1],
                                prevIsEnabled = prev && finishedSteps.indexOf(prev.act) !== -1 || false;

                            return [
                                {
                                    block: 'checkbox',
                                    js: true,
                                    mods: {
                                        disabled: true,
                                        theme: 'islands',
                                        size: 'm',
                                        act: item.act,
                                        checked: finishedSteps.indexOf(item.act) !== -1
                                    },
                                    mix: { block: 's-speaker', elem: 'checkbox' }
                                },
                                {
                                    elem: 'line',
                                    attrs: { style: k ? '' : 'margin-top: 0;' },
                                    mods: {
                                        disabled: k && finishedSteps.indexOf(item.act) === -1 && !prevIsEnabled
                                            ? 'yes'
                                            : '',
                                        act: item.act
                                    },
                                    content: item.text
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

        ]);

    }
});
