modules.define(
    'page',
    ['i-bem__dom', 'jquery'],
    function(provide, Page, $) {

        provide(Page.decl('page', {

        },
        {
            setContent: function(content) {
                $('.page__content').html(content);
            }
        }));

    }

);
