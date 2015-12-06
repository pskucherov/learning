BEMPRIV.decl('rating', {
    init: function() {

        this.js(true);

        this.content(this.getContent());

    },

    getContent: function() {
        var p = 'data:image/png;base64,';
        return [
            'borschik:include:./first-place_size_sb.png',
            'borschik:include:./second-place_size_sb.png',
            'borschik:include:./third-place_size_sb.png',
            ''
        ].map(function(img, i) {
            return img
                ? {
                    elem: 'user',
                    elemMods: { pos: i, hidden: 'yes' },
                    content: {
                        block: 'rating',
                        elem: 'stats',
                        content: [
                            this._getFadeAndStat(),
                            {
                                block: 'image',
                                url: p + img
                            }
                        ]
                    }
                }
                : [{
                    elem: 'dots',
                    elemMods: { hidden: 'yes' },
                    content: '...'
                },
                {
                    elem: 'user',
                    elemMods: { pos: 100500, hidden: 'yes' },
                    content: this._getFadeAndStat()
                }];
        }.bind(this));
    },

    /**
     * Получить фейд со статой
     * @returns {{}}
     * @private
     */
    _getFadeAndStat: function() {
        return [{
            block: 'rating',
            elem: 'stat-text',
            content: '100500'
        }, {
            block: 'rating',
            elem: 'fade'
        }];
    }

});
