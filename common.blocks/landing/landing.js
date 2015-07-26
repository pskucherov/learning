modules.define(
    'landing',
    ['i-bem__dom', 'jquery'],
    function(provide, Landing, $) {

    provide(Landing.decl('landing', {

            onSetMod: {
                js: {
                    inited: function () {


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
            },

            /**
             * Получить анкор первого элемента
             * @returns {*}
             */
            getFirstHash: function() {
                return this.elem('wrapper').attr('id');
            }


        },
        {
            getNextSlide: function(currentHash) {
                return $('#' + currentHash).next();
            },
            getPrevSlide: function(currentHash) {
                return $('#' + currentHash).prev();
            }
        }
    ));

});
