modules.define(
    'page',
    ['i-bem__dom', 'jquery'],
    function(provide, BEMDOM, $) {

        provide(BEMDOM.decl('page', {

        },
        {
            setContent: function(content) {
                BEMDOM.update($('.page__content'), content);
            }
        }));

    }

);
