BEMPRIV.decl('s-competitions', {
    init: function() {

        this.js(true);

        this.content([
            {
                block: 's-competitions',
                elem: 'title',
                content: 'Конкурсы'
            },
            {
                block: 's-competitions',
                elem: 'list',
                content: _.map(this.data.res.consultorQuestions, function(q) {
                    return {
                        block: 's-competitions-item',
                        mix: [{ block: 's-competitions', elem: 'item' }],
                        js: { id: q._id },
                        photo: _.get(q, 'user.photo_100', ''),
                        question: q.question,
                        answerCount: parseInt(q.answersCount || 0, 10),
                        likeCount: parseInt(q.likeCount || 0, 10)
                    };
                })
            }
        ]);

    }
});
