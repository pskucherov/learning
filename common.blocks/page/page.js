modules.define(
    'page',
    ['i-bem__dom', 'jquery', 'i-bem__dom'],
    function(provide, Page, $, BEMDOM) {

        provide(Page.decl('page', {

        },
        {
            setContent: function(content) {
                BEMDOM.update($('.page__content'), content);
            }
        }));

    }

);
