BEMPRIV.decl('rating', {
    init: function() {

        this.js(true);

        this.content(this.getContent());

    },

    getContent: function() {
        var p = 'data:image/png;base64,';
        return [
            {
                elem: 'user',
                elemMods: { pos: 0, hidden: 'yes' },
                content: {
                    block: 'rating',
                    elem: 'stats',
                    content: {
                        block: 'image',
                        url: p + 'borschik:include:./first-place_size_sb.png'
                    }
                }
            },
            {
                elem: 'user',
                elemMods: { pos: 1, hidden: 'yes' },
                content: {
                    block: 'rating',
                    elem: 'stats',
                    content: {
                        block: 'image',
                        url: p + 'borschik:include:./second-place_size_sb.png'
                    }
                }
            },
            {
                elem: 'user',
                elemMods: { pos: 2, hidden: 'yes' },
                content: {
                    block: 'rating',
                    elem: 'stats',
                    content: {
                        block: 'image',
                        url: p + 'borschik:include:./third-place_size_sb.png'
                    }
                }
            },
            {
                elem: 'dots',
                elemMods: { hidden: 'yes' },
                content: '...'
            },
            {
                elem: 'user',
                elemMods: { pos: 100500, hidden: 'yes' }
                /*content: {
                    block: 'rating',
                    elem: 'arrow',
                    content: 'Вы 136й'
                }*/
            }
        ];
    }
});
