var express = require('express'),
    router = express.Router(),
    DEFAULT_REDIR_URL = 'https://школьник.com/';

router.get(/^\/(\d+)\/?$/, function(req, res, next) {

    var redirectId = parseInt(req.params[0], 10);

    if (redirectId > 0) {

        res.redirect(DEFAULT_REDIR_URL);

    } else {
        next();
    }

});

module.exports = router;
