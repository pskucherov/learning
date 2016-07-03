BEMPRIV.decl('s-brain', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 'class-select',
                val: this.data.cookies.classNum
            },
            BEMPRIV.json({ block: 'rating', modName: 's-brain', modVal: 'yes' }, this.data),
            {
                block : 'button',
                mix: { block: 's-brain', elem: 'next-question' },
                mods : { theme : 'islands', size : 'l' },
                text : 'Следующий вопрос'
            },
            {
                block: 'blackboard',
                content: [
                    {
                        block: 's-brain',
                        elem: 'title'
                    },
                    {
                        block: 's-brain',
                        elem: 'question',
                        content: {
                            block : 'spin',
                            mods : {
                                theme: 'islands', size: 'xl', visible: true
                            }
                        }
                    },
                    {
                        block: 's-brain',
                        elem: 'answers'
                    }
                ]
            }
        ]);

    }
});
