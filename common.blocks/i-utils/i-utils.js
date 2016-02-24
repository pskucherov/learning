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
                },

                /**
                 * Распарсить микросекунды
                 *
                 * @param {Number} ms
                 * @returns {Object}
                 */
                parseMicroseconds: function(ms) {
                    var seconds = parseInt(ms / 1000, 10),
                        d = parseInt(seconds / 86400, 10),
                        h = parseInt((seconds - d * 86400) / 3600, 10),
                        m = parseInt((seconds - d * 86400 - h * 3600) / 60),
                        s = seconds - d * 86400 - h * 3600 - m * 60;

                    return {
                        s: s,
                        m: m,
                        h: h,
                        d: d
                    };
                }

            }));
    }
);
