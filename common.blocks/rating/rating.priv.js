BEMPRIV.decl('rating', {
    init: function() {

        this.js(true);

        this.content(this.getContent());

    },

    getContent: function() {
        return [
            {
                elem: 'user',
                attrs: {
                    style: 'width: 100px; height: 100px; border-radius: 100%; background-color: red; margin: 15px 0;'
                },
                content: {
                    block: 'rating',
                    elem: 'stats',
                    content: '1е место'
                }
            },
            {
                attrs: {
                    style: 'width: 100px; height: 100px; border-radius: 100%; background-color: red; margin: 15px 0;'
                }
            },
            {
                attrs: {
                    style: 'text-align: center; font-size: 52px; color: #666; top: -40px; position: relative;'
                },
                content: '...'
            },
            {
                attrs: {
                    style: 'width: 100px; height: 100px; border-radius: 100%; background-color: red; margin: -40px 0;'
                }
            }
        ];
    }
});
