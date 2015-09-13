var express = require('express'),
    router = express.Router(),
    PATH = require('path'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring');


/**
 * Страница для gemini-тестов
 */
router.get(/^\/tests\/?$/, function(req, res, next) {

    var pathToBundle = PATH.join('.', 'desktop.bundles', 'test');

    //res.searchObj = url.parse(req.url, true).query;
    //res.queryString = querystring.escape(res.searchObj.query);

    //res.bemtree= fs.readFileSync(PATH.join(pathToBundle, 'test.bemtree.js'), 'utf-8');
    //res.BEMHTML = require(PATH.join('../../../' + pathToBundle, 'test.bemhtml.js')).BEMHTML;

    res.html = fs.readFileSync(PATH.join(pathToBundle, 'test.html'), 'utf-8');

    next();

});


/**
 * Страница для проверки ajax-переходов
 */
router.get(/^\/spage\/?$/, function(req, res, next) {

    var pathToBundle = PATH.join('.', 'desktop.bundles', 'second-page');

    res.BEMHTML = require(PATH.join('../../../' + pathToBundle, '_second-page.bemhtml.js')).BEMHTML;

    res.priv = require(PATH.join(pathToBundle, '_second-page.priv.js'), 'utf-8');

    next();

});


module.exports = router;
