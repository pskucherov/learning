modules.define(
    'i-utils',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            },
            {
                /**
                 * Склонение числительных
                 *
                 * @param {Number} number
                 * @param {String[]} titles
                 * @returns {*}
                 */
                declOfNum: function(number, titles) {
                    cases = [2, 0, 1, 1, 1, 2];
                    return titles[(number % 100 > 4 && number % 100 < 20) ? 2 : cases[(number % 10 < 5) ? number % 10 : 5]];
                }
            }));
    }
);
