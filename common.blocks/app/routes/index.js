var express = require('express'),
    router = express.Router(),
    PATH = require('path'),
    fs = require('fs'),
    vk = require('../controllers/vk'),
    User = require('../controllers/User'),
    _ = require('lodash'),
    settings = require('../settings'),
    cookieName = 'vk_app_' + settings.vk.appId;


/**
 * Авторизация пользователя. Выполняется для всех и передаёт управление дальше.
 */
router.get(/.*/, function(req, res, next) {
    res.appId = settings.vk.appId;
    res.user = new User(req.models.users, { sid: req.cookies[cookieName] || req.session[cookieName] }, next);
});

/**
 * Удаляем куку и редиректим на главную.
 */
router.get(/^\/logout\/?$/, function(req, res, next) {
    res.clearCookie(cookieName, { path: '/', domain: req.headers.host });
    res.clearCookie(cookieName, { path: '/', domain: '.' + req.headers.host });
    res.clearCookie(cookieName, { path: '/', domain: req.headers.hostname });
    res.clearCookie(cookieName, { path: '/', domain: '.' + req.headers.hostname });
    res.redirect('/');
});

router.get(/^\/verify\/?$/, function(req, res, next) {

    var protocol = req.headers.host.indexOf('.com') === -1 ? 'http' : 'https';
    // Коллбэк, куда вернёт вк после авторизации
    var callBackUrl = protocol + '://' + req.headers.host + '/verify',
        finish = function() {
            //res.redirect('/');
            next();
        },
        page = 'verify',
	pathToBundle = PATH.join('../../../', 'desktop.bundles', page);

    res.BEMHTML = require(PATH.join(pathToBundle, '_' + page + '.bemhtml.js')).BEMHTML;

    res.pageName = page;
    res.priv = require(PATH.join(pathToBundle, '_' + page + '.priv.js'), 'utf-8');

    vk.requestServerToken(function(_o) {

        if (!_o.user_id) {
            finish();
            return;
        }

        // Запрашиваем доступы, которые разрешил пользователь
        vk.request('account.getAppPermissions', { user_id: _o.user_id }, function(permissions) {

            // Если приложение не установили, не подтвердили права или не авторизовались — выходим
            if (!permissions || permissions.response <= 0) {
                finish();
                return;
            }

            // Создаём или ищем существующего пользователя
            User.createByVKId(req.models.users, _o.user_id)
                .then(function (createdUser) {

                    vk.setToken(_o.access_token);
                    vk.setSecureRequests(true);


                    // Запрашиваем данные пользователя, чтобы сохранить их в БД (если изменились).
                    vk.request('users.get',
                        { user_id: _o.user_id, fields: 'sex,photo_50,photo_100,photo_200_orig,photo_200,has_mobile' },
                        function (userFields) {

                            if (_.get(userFields, 'response[0].id') !== _o.user_id) {
                                finish();
                                return;
                            }

                            createdUser.email = _o.email;
                            createdUser.access_token = _o.access_token;
                            createdUser.lastvisit = Math.floor(Date.now() / 1000);

                            _.defaultsDeep(createdUser, userFields.response[0]);

                            User.updateFieldsByVKId(req.models.users, _o.user_id, createdUser).always(function() {
                                finish();
                            });

                        });
                });
        });

    }, req.query.code, callBackUrl);

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

    /*
            User.getByVKId(req.models.users, 108239190).then(function (u) {

            console.log(u[0].access_token);

            vk.setToken(u[0].access_token);
            vk.setSecureRequests(true);

            // Запрашиваем данные пользователя, чтобы сохранить их в БД (если изменились).
            vk.request('account.getAppPermissions', {},

                function (userFields) {

                    console.log('here');
                    console.log(JSON.stringify(userFields, null, 4));

                });

            });
    */

    res.BEMHTML = require(PATH.join(pathToBundle, '_' + page + '.bemhtml.js')).BEMHTML;

    res.pageName = page;
    res.priv = require(PATH.join(pathToBundle, '_' + page + '.priv.js'), 'utf-8');

    next();
});


module.exports = router;
