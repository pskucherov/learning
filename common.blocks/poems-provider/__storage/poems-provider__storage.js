modules.define('poems-provider__storage', ['inherit'], function(provide, inherit) {

provide(inherit({
    __constructor : function(data) {
        this._data = data.map(function(item) {
            return {
                text: item,
                val: item
            };
        });


    },

    /**
     * @param {Object} params
     * @param {Function} callback
     */
    find: function(params, callback) {

        // Передаём автора стиха. Если нет автора, то ничего не найдётся
        window.socket.emit('provider:act:find-' + params.act, params.val,
            params.act === 'poem' ? $('.suggest_act_author .input__control').val() : ''
        );
        window.socket.on('provider:data:' + params.act, this['_provideData' + params.act].bind(this, callback));

    },

    _provideDataauthor: function(callback, authors) {

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

    _provideDatapoem: function(callback, authors) {

        callback(null,
            authors.map(function(item) {
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
