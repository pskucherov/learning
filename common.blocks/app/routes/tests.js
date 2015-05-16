var express = require('express'),
    router = express.Router(),
    PATH = require('path'),
    fs = require('fs'),
    url = require('url'),
    querystring = require('querystring'),
    pathToBundle = PATH.join('.', 'desktop.bundles', 'test');

router.get(/^\/tests\/?$/, function(req, res, next) {

    //res.searchObj = url.parse(req.url, true).query;
    //res.queryString = querystring.escape(res.searchObj.query);

    //res.bemtree= fs.readFileSync(PATH.join(pathToBundle, 'test.bemtree.js'), 'utf-8');
    //res.BEMHTML = require(PATH.join('../../../' + pathToBundle, 'test.bemhtml.js')).BEMHTML;

    res.html = fs.readFileSync(PATH.join(pathToBundle, 'test.html'), 'utf-8');

    next();

});

module.exports = router;
