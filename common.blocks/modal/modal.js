/**
 * @module modal
 */

modules.define(
    'modal',
    ['i-bem__dom', 'BEMHTML'],
    function(provide, BEMDOM, BEMHTML) {

/**
 * @exports
 * @class modal
 * @bem
 *
 * @bemmod visible Represents visible state
 */
provide(BEMDOM.decl(this.name, /** @lends modal.prototype */{

    onSetMod : {
        visible: {
            '': function () {
                if (this.needDestruct) {
                    BEMDOM.destruct(this.elem('content'), true);
                    this.needDestruct = false;
                }
                return this.__base.apply(this, arguments);
            }
        }
    },

    /**
     * Sets content
     * @param {String|jQuery} content
     * @returns {modal} this
     *
     * @override
     */
    setContent : function(content) {

        var elem = this.elem('content');

        this.needDestruct = true;

        BEMDOM.destruct(elem, true);
        BEMDOM.update(elem, BEMHTML.apply([{
            block: 'modal',
            elem: 'close'
        }, content]));

        return this;
    }
}, /** @lends modal */{
    live: function() {
        this.liveBindTo('close', 'pointerclick', function() {
            this.setMod('visible', false);
        });

        return this.__base.apply(this, arguments);
    }
}));

});
