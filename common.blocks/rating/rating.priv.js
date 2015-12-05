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
                attrs: {
                    style: 'width: 70px; height: 70px; border-radius: 100%; background-color: red; margin: 15px 0;'
                },
                content: {
                    block: 'rating',
                    elem: 'stats',
                    content: {
                        block: 'image',
                        attrs: { style: 'position: absolute; bottom: -15px; right: 0;' },
                        url: p + 'borschik:include:./first-place_size_sb.png'
                    }
                }
            },
            {
                elem: 'user',
                elemMods: { pos: 1, hidden: 'yes' },
                attrs: {
                    style: 'width: 70px; height: 70px; border-radius: 100%; background-color: red; margin: 15px 0;'
                },
                content: {
                    block: 'rating',
                    elem: 'stats',
                    content: {
                        block: 'image',
                        attrs: { style: 'position: absolute; bottom: -15px; right: 0;' },
                        url: p + 'borschik:include:./second-place_size_sb.png'
                    }
                }
            },
            {
                elem: 'user',
                elemMods: { pos: 2, hidden: 'yes' },
                attrs: {
                    style: 'width: 70px; height: 70px; border-radius: 100%; background-color: red; margin: 15px 0;'
                },
                content: {
                    block: 'rating',
                    elem: 'stats',
                    content: {
                        block: 'image',
                        attrs: { style: 'position: absolute; bottom: -15px; right: 0;' },
                        url: p + 'borschik:include:./third-place_size_sb.png'
                    }
                }
            },
            {
                elem: 'dots',
                elemMods: { hidden: 'yes' },
                attrs: {
                    style: 'text-align: center; font-size: 52px; color: #666; top: -40px; position: relative;'
                },
                content: '...'
            },
            {
                elem: 'user',
                elemMods: { pos: 100500, hidden: 'yes' },
                attrs: {
                    style: 'width: 70px; height: 70px; border-radius: 100%; background-color: red; margin: -40px 0;'
                },
                content: {
                    block: 'rating',
                    elem: 'arrow',
                    content: 'Вы 136й'
                }
            }
        ];
    }
});
