var express = require('express'),
    router = express.Router(),
    PATH = require('path'),
    fs = require('fs'),
    vk = require('../controllers/vk'),
    User = require('../controllers/user');

/**
 * Страница для gemini-тестов
 */
router.get(/^\/verify\/?$/, function(req, res) {

    var callBackUrl = req.protocol + '://' + req.headers.host + '/verify';

    vk.requestServerToken(function(_o) {


        // Here will be server access token
        console.log(_o, '\n _o.access_token = ' + _o.access_token);


        User.createUserByVKId(req.models.users, _o.user_id)
            .then(function() {

                vk.setToken(_o.access_token);

                vk.setSecureRequests(true);

                vk.request('account.getAppPermissions', {'user_id': _o.user_id}, function(q) {
                    console.log(q);
                });

                vk.request('users.get', {'user_id' : _o.user_id, fields: 'email,contacts' }, function(q) {
                    console.log(q);
                    res.end(JSON.stringify(q, null, 4));
                });

            });

    }, req.query.code, callBackUrl);


    //vk.setSecureRequests(true);



    //vk.request('users.get', {'user_id' : 108239190}, function(q) {
    //    console.log(q);
    //});

    /**
     * Request server methods
     */
/*
// Setup server access token for server API methods
    vk.on('serverTokenReady', function(_o) {
        // Here will be server access token
        vk.setToken(_o.access_token);

        vk.setSecureRequests(true);


// Request 'users.get' method
        vk.request('users.get', {'user_id' : 108239190}, function(_o) {
            console.log(_o);
        });


// Request server API method
        vk.request('secure.getSMSHistory', {}, function(_dd) {
            console.log(_dd);
        });


    });
*/

// Turn on requests with access tokens




    /*
    vk.on('serverTokenReady', function(_o) {
        console.log('serverTokenReady');
        // Here will be server access token
        res.end(JSON.stringify(_o, null, 4));
    });

    /*
    //vk.setSecureRequests(false);
    vk.request('account.getAppPermissions', {'user_id': 108239190}, function(_o) {
        console.log(_o);
        res.end(JSON.stringify(_o, null, 4));
    });
    */


});





/**
 * Страница для gemini-тестов
 */
router.get(/^\/tests\/?$/, function(req, res, next) {

    var pathToBundle = PATH.join('../../../', 'desktop.bundles', 'test');

    //res.searchObj = url.parse(req.url, true).query;
    //res.queryString = querystring.escape(res.searchObj.query);

    //res.bemtree= fs.readFileSync(PATH.join(pathToBundle, 'test.bemtree.js'), 'utf-8');
    //res.BEMHTML = require(PATH.join('../../../' + pathToBundle, 'test.bemhtml.js')).BEMHTML;

    res.html = fs.readFileSync(PATH.join(pathToBundle, 'test.html'), 'utf-8');

    next();

});

/**
 * Главная
 */
router.get(/^\/?$/, function(req, res, next) {
    var page = 'index',
        pathToBundle = PATH.join('../../../', 'desktop.bundles', page);

    res.BEMHTML = require(PATH.join(pathToBundle, '_' + page + '.bemhtml.js')).BEMHTML;

    res.pageName = page;
    res.priv = require(PATH.join(pathToBundle, '_' + page + '.priv.js'), 'utf-8');

    next();
});


module.exports = router;
