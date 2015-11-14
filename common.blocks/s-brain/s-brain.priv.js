BEMPRIV.decl('s-brain', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 'blackboard',
                content: [
                    {
                        block: 's-brain',
                        elem: 'title'
                    },
                    {
                        block: 's-brain',
                        elem: 'question'
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
