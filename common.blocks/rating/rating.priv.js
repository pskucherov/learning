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
                        elemMods: { pos: i },
                        content: [
                            this._getFadeAndStat(i),
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
                    content: this._getFadeAndStat(100500)
                }];
        }.bind(this));
    },

    /**
     *
     * @param {Number} pos
     * @returns {Object[]}
     * @private
     */
    _getFadeAndStat: function(pos) {
        return [{
            block: 'rating',
            elem: 'stat-text',
            elemMods: { pos: pos, hidden: 'yes' },
            content: '100500'
        }, {
            block: 'rating',
            elemMods: { pos: pos, hidden: 'yes' },
            elem: 'fade'
        }];
    }

});
