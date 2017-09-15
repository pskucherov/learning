modules.define(
    'page-search',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

        }, {
            live: function() {

                if (location.href.indexOf('web=0') !== -1) {
                    var waitForm = setInterval(function () {
                        replaceWebParam();
                    }, 100);
                }

                function replaceWebParam() {
                    if ($('#ya-site-results b').length) {
                        clearInterval(waitForm);
                    }

                    if ($('#ya-site-results b')
                        .contents()
                        .filter(function() {
                            return $(this).text() === 'Искомая комбинация слов нигде не встречается';
                        }).length) {

                        location.href = location.href.replace('web=0', 'web=1');
                    }
                }

                return true;
            }
        }));
    }
);
