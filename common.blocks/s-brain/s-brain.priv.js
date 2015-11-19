BEMPRIV.decl('s-brain', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 'class-select',
                val: this.data.cookies.classNum
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
