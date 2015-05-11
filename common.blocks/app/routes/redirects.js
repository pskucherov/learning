var express = require('express'),
    router = express.Router();

router.get(/^\/(\d+)\/?$/, function(req, res, next) {

    var redirectId = parseInt(req.params[0], 10),
        redirectUrl = 'https://vk.com/app3098668';

    if (redirectId > 0) {

        res.redirect(redirectUrl + '#r=' + redirectId);

    } else {
        next();
    }

});

module.exports = router;
