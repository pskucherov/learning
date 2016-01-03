modules.define('poems-provider__storage', ['inherit', 's-speaker'], function(provide, inherit, speaker) {

provide(inherit({
    __constructor : function(data) {
        this._data = data.map(function(item) {
            return {
                text: item,
                val: item
            };
        });

        this.errorInterval = null;

    },

    /**
     * @param {Object} params
     * @param {Function} callback
     */
    find: function(params, callback) {

        // TODO: добавить trim
        var author = $('.suggest_act_author .input__control').val();

        $('.s-speaker__text .textarea_act_text').attr('placeholder', 'Здесь будет содержание');

        // Передаём автора стиха. Если нет автора, то ничего не найдётся
        window.socket.emit('provider:act:find-' + params.act, params.val,
            params.act === 'poem' ? author : ''
        );
        window.socket.on('provider:data:' + params.act,
            this['_provideData' + params.act].bind(this, callback, author, params.val)
        );

    },

    _provideDataauthor: function(callback, a, val, authors) {

        $('.suggest_act_poem .input__control').val('');

        callback(null,
            authors.map(function(item) {
                return {
                    text: item.name,
                    val: item.name
                };
            })
        );
        window.socket.removeAllListeners('provider:data:author');

    },

    _provideDatapoem: function(callback, author, val, poems) {

        clearTimeout(this.errorInterval);

        if (_.isEmpty(poems)) {
            this.errorInterval = setTimeout(function() {
                speaker.enableYaSearchButton();
                speaker.setPlaceholder(val, author);
            }.bind(this), 5000);
        }

        callback(null,
            poems.map(function(item) {

                if (item.name === val) {
                    console.log('Совпадают');
                }

                return {
                    text: item.name,
                    val: item.name
                };
            })
        );
        window.socket.removeAllListeners('provider:data:poem');

    }

}));

});
