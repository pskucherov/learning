BEMPRIV.decl('s-consultor', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-consultor',
                elem: 'show-popup-button',
                js: { add: 's-consultor-question' },
                content: {
                    block: 'button',
                    mods: { theme: 'islands', size: 'l' },
                    text: 'Задать вопрос'
                }
            },
            {
                block: 's-consultor',
                elem: 'list',
                content:
                {
                    block: 'rating',
                    content: _.map(this.data.res.consultorQuestions, function(q) {
                        return {
                            block: 's-consultor',
                            elem: 'item',
                            mix: {block: 's-consultor-item', js: {id: q._id}},
                            content: [
                                {
                                    block: 'rating',
                                    elem: 'user',
                                    attrs: {
                                        style: "background-image: url(" + q.user.photo_100 + "); background-size: cover;"
                                    },
                                    content: {
                                        block: 'rating',
                                        elem: 'stats',
                                        content: [
                                            {
                                                block: 'rating',
                                                elem: 'stat-text',
                                                content: _.trim(parseInt(q.answersCount || 0, 10) + ' 💬 <br>' + parseInt(q.likeCount || 0, 10)
                                                    + ' 💌')
                                            },
                                            {
                                                block: 'rating',
                                                elem: 'fade'
                                            }
                                        ]
                                    }
                                },
                                {
                                    elem: 'question-text',
                                    content: q.question
                                }
                            ]
                        };
                    })
                }
            },
            {
                block: 'modal',
                mods: {
                    theme : 'islands',
                    add: 's-consultor-question'
                },
                mix: { block: 's-consultor', elem: 'modal' },
                content: {
                    block: 's-consultor',
                    elem: 'popup-add-question'
                }
            },
            {
                block: 'modal',
                mods: {
                    theme : 'islands',
                    add: 'question'
                },
                mix: { block: 's-consultor', elem: 'modal' },
                content: {
                    block: 's-consultor',
                    elem: 'popup-show-question'
                }
            }
        ]);

    }
});
