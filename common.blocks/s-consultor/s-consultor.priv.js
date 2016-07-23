BEMPRIV.decl('s-consultor', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-consultor',
                elem: 'title',
                content: 'Есть вопросы? Спроси здесь!'
            },
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
                content: _.map(this.data.res.consultorQuestions, function(q) {
                    return {
                        block: 's-consultor-item',
                        mix: [{ block: 's-consultor', elem: 'item' }],
                        js: { id: q._id },
                        photo: _.get(q, 'user.photo_100', ''),
                        question: q.question,
                        answerCount: parseInt(q.answersCount || 0, 10),
                        likeCount: parseInt(q.likeCount || 0, 10)
                    };
                })
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
