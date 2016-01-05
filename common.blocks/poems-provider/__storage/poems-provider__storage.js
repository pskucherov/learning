modules.define('poems-provider__storage', ['inherit', 'select-poem'], function(provide, inherit, selectPoem) {

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

        // TODO: добавить trim + статические методы из select-poem
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

    _provideDataauthor: function(callback, author, val, authors) {

        clearTimeout(this.errorInterval);

        if (_.isEmpty(authors)) {
            this.errorInterval = setTimeout(function() {
                selectPoem.getPoemIfExists();
            }.bind(this), 5000);
        }

        callback(null,
            authors.map(function(item) {

                if (item.name === author) {
                    selectPoem.getPoemIfExists(author);
                }

                return {
                    text: item.name,
                    val: {
                        author: item.name,
                        name: item.name
                    }
                };
            })
        );
        window.socket.removeAllListeners('provider:data:author');

    },

    _provideDatapoem: function(callback, author, val, poems) {

        clearTimeout(this.errorInterval);

        if (_.isEmpty(poems)) {
            this.errorInterval = setTimeout(function() {
                selectPoem.getPoemIfExists();
            }.bind(this), 5000);
        }

        callback(null,
            poems.map(function(item) {
                var author = _.get(item, 'author.name', '');

                // Костыль: если после клика по item вызвался метод
                if (item.name === val) {
                    selectPoem.getPoemIfExists(author, val);
                }

                return {
                    text: item.name,
                    val: {
                        name: item.name,
                        author: author,
                        poemName: item.name
                    }

                };
            })
        );
        window.socket.removeAllListeners('provider:data:poem');

    }

}));

});
