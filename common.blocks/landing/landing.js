modules.define(
    'landing',
    ['i-bem__dom', 'jquery'],
    function(provide, Landing, $) {

    provide(Landing.decl('landing', {

        onSetMod: {
            js: {
                inited: function () {

                    this.bindToWin('resize', _.throttle(function(e) {
                        console.log(arguments)
                    }, 200, this))

                }
            }
        },

        /**
         * Установить высоту элементов wrapper
         * @param {Number} height - высота, которую надо установить.
         * @returns {*}
         */
        setHeightToWrapper: function(height) {
            return this.elem('wrapper').height(height);
        }

    }));

});
