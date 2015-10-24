var express = require('express'),
    router = express.Router(),
    PATH = require('path'),
    fs = require('fs'),
    vk = require('../controllers/vk'),
    User = require('../controllers/user'),
    _ = require('lodash');

/**
 * Страница для gemini-тестов
 */
router.get(/^\/verify\/?$/, function(req, res) {

    // Коллбэк, куда вернёт вк после авторизации
    var callBackUrl = req.protocol + '://' + req.headers.host + '/verify',
        finish = function() {
            res.redirect('/');
        };

    vk.requestServerToken(function(_o) {

        var email;

        // Запрашиваем доступы, которые разрешил пользователь
        vk.request('account.getAppPermissions', { user_id: _o.user_id }, function(permissions) {

            // Если приложение не установили, не подтвердили права или не авторизовались — выходим
            if (!permissions || permissions.response <= 0) {
                finish();
            }

            email = _o.email;

            // Создаём или ищем существующего пользователя
            User.createByVKId(req.models.users, _o.user_id)
                .then(function (createdUser) {

                    vk.setToken(_o.access_token);
                    vk.setSecureRequests(true);

                    // Запрашиваем данные пользователя, чтобы сохранить их в БД (если изменились).
                    vk.request('users.get', { user_id: _o.user_id, fields: 'sex,bdate,photo_50,photo_100,photo_200_orig,photo_200,has_mobile' }, function (userFields) {
                        if (_.get(userFields, 'response[0].id') !== _o.user_id) {
                            finish();
                        }

                        createdUser.email = email;

                        _.defaultsDeep(createdUser, userFields.response[0]);

                        console.log(createdUser);
                        console.log(_o.user_id);
                        User.updateFieldsByVKId(req.models.users, _o.user_id, createdUser).then(function() {
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

    res.BEMHTML = require(PATH.join(pathToBundle, '_' + page + '.bemhtml.js')).BEMHTML;

    res.pageName = page;
    res.priv = require(PATH.join(pathToBundle, '_' + page + '.priv.js'), 'utf-8');

    next();
});


module.exports = router;
