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

    /**
     * Sets content
     * @param {String|jQuery} content
     * @returns {modal} this
     *
     * @override
     */
    setContent : function(content) {

        var elem = this.elem('content');

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
