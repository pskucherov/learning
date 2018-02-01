var express = require('express'),
    router = express.Router(),
    PATH = require('path'),
    fs = require('fs'),
    vk = require('../controllers/vk'),
    User = require('../controllers/User'),
    Complaints = require('../controllers/Complaints'),
    BrainTests = require('../controllers/BrainTests'),
    Poems = require('../controllers/Poems'),
    _ = require('lodash'),
    settings = require('../settings'),
    cookieName = settings.vk.cookieName,

    SpeakerLearnPoem = require('../controllers/SpeakerLearnPoem'),
    Authors = require('../controllers/Authors'),
    Competitions = require('../controllers/Competitions'),
    Consultor = require('../controllers/Consultor');

var multer = require('multer');
var cyrillicToTranslit = require('cyrillic-to-translit-js');

/**
 * Авторизация пользователя. Выполняется для всех и передаёт управление дальше.
 */
router.all(/.*/, function(req, res, next) {
    // Для всех страниц формируется единый css и js, т.к. это SPA
    var page = 'index',
        pathToBundle = PATH.join('../../../', 'desktop.bundles', page);

    res.BEMHTML = require(PATH.join(pathToBundle, '_' + page + '.bemhtml.js')).BEMHTML;
    res.priv = require(PATH.join(pathToBundle, '_' + page + '.priv.js'), 'utf-8');

    res.appId = settings.vk.appId;
    res.user = new User(req.models.users, { sid: req.cookies[cookieName] }, next);
});

/**
 * Страница выхода. Удаляем куку и редиректим на главную.
 */
router.get(/^\/logout\/?$/, function(req, res) {
    res.clearCookie(cookieName, { path: '/', domain: req.headers.host });
    res.clearCookie(cookieName, { path: '/', domain: '.' + req.headers.host });
    res.clearCookie(cookieName, { path: '/', domain: req.headers.hostname });
    res.clearCookie(cookieName, { path: '/', domain: '.' + req.headers.hostname });
    req.session.redirPage = '/';
    res.redirect('/');
});

/**
 * Страница обработки жалобы
 */
router.post(/^\/ajax\/complaint-send\/?$/, function(req, res, next) {

    res.html = '0';

    var p = JSON.parse(req.body.complaintJson);

    if (!res.user.isAuth || _.isEmpty(p)) {
        next();
        return;
    }

    res.html = '1';

    switch(p.type) {

        // Жалоба на вопросы в s-brain
        case 1:
            BrainTests.incQuestionComplaints(req.models['brain-tests'], p.qId);
            Complaints.createComplaint(req.models.complaints, 'brain-tests', p.qId, p.complaint, p.comment, res.user._id);
            break;

    }

    next();

});

/**
 * Страница авторизации пользователя через ВК.
 */
router.get(/^\/verify\/?$/, function(req, res, next) {

    var protocol = req.headers.host.indexOf('.com') === -1 ? 'http' : 'https';
    // Коллбэк, куда вернёт вк после авторизации
    var callBackUrl = protocol + '://' + req.headers.host + '/verify',
        finish = function() {
            //res.redirect('/');
            next();
        },
        page = 'verify';

    res.pageName = page;

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
                    // TODO: есть пользователь, у которого пустой
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
    res.pageName = 'index';
    req.session.redirPage = '/';
    req.session.pageName = 'index';

    next();
});

/**
 * Выход
 */
router.get(/^\/exit\/?$/, function(req, res, next) {
    res.pageName = 'exit';
    req.session.redirPage = '/';
    req.session.pageName = 'index';

    next();
});

/**
 * Оратор
 */
router.get(/^\/speaker\/?$/, function(req, res, next) {

    if ((!res.user || !res.user.isAuth)) {
        res.pageName = 'exit';
        req.session.redirPage = '/speaker';
        next();
    } else {
        res.pageName = 's-speaker';

        req.session.pageName = 's-speaker';

        SpeakerLearnPoem.getDataOfProgress(req.models['speaker-learn-poem'], res.user._id)
            .then(function (progress) {
                res.speakerLearnPoem = progress;
                next();
            });
    }

});

/**
 * Советчик
 */
router.get(/^\/consultor\/?$/, function(req, res, next) {

    if (!res.user || !res.user.isAuth) {
        res.pageName = 'exit';
        req.session.redirPage = '/consultor';
    } else {
        res.pageName = 's-consultor';
    }

    req.session.pageName = 's-consultor';

    Consultor.getAllQuestions(req.db)
        .then((questions) => {
            res.consultorQuestions = questions;
            next();
        }, () => {
            res.consultorQuestions = [];
            next();
        });

});

/**
 * Соревнования
 */
router.get(/^\/competitions\/?$/, function(req, res, next) {
    if (!res.user || !res.user.isAuth) {
        res.pageName = 'exit';
        req.session.redirPage = '/competitions';
    } else {
        res.pageName = 's-competitions';
    }

    req.session.pageName = 's-competitions';

    Competitions.aggregatePosts(req.models['vk-group-wall'])
        .then((data) => {
            let usersIds = [];

            _.forEach(data, (val, key) => {
                usersIds.push(val._id.from_id);
            });

            User.getByVKId(req.models['users'], usersIds)
                .then((users) => {


                    console.log(users);
                    
                    _.forEach(users, (val, key) => {

                        console.log(1);

                        let index = _.findIndex(data, (o) => {
                            return o._id.from_id === val.vkid;
                        });

                        console.log(2);
                        if (index === -1) {
                            delete data[index];
                        } else {
                            data[index].user = val;
                        }

                        console.log(3);

                    });


                    console.log(data);

                    res.competitionsData = data;
                    next();

                });

        });


});

/**
 * Оратор
 */
router.get(/^\/warden\/?$/, function(req, res, next) {

    if (!res.user || !res.user.isAuth) {
        res.pageName = 'exit';
        req.session.redirPage = '/warden';
    } else {
        res.pageName = 's-warden';
    }


    if (!_.isEmpty(req.query.del)) {
        Poems.delByIdWithAuthor(req.models['poems'], req.models['authors'], req.models['speaker-learn-poem'], req.query.del).then((data) => {
            res.redirect('/warden');
        });
    } else {
        req.session.pageName = 's-warden';
        Poems.getUnverified(req.models['poems'], req.models['authors']).then((data) => {
            res.poems = data;
            next();
        }, () => next());
    }
});

/**
 * Добавление и редактирование текстов.
 */
router.get(/^\/articles\/?$/, function(req, res, next) {
    if (!res.user || !res.user.isAuth) {
        res.pageName = 'exit';
        req.session.redirPage = '/articles';
    } else {
        res.pageName = 'page-texts';
    }

    next();
});

/**
 * Поиск.
 */
router.get(/^\/search/, function(req, res, next) {
    res.pageName = 'page-search';
    next();
});

/**
 * Подтверждение г-аналитики. Типа статический файл.
 */
router.get(/^\/googlefd88dd6fbba09a7a.html$/, function(req, res, next) {
    res.send('200', 'google-site-verification: googlefd88dd6fbba09a7a.html');
    return res.end();
});

/**
 * Загрузка изображения.
 */
router.post(/^\/upload\/image$/, function(req, res, next) {
    if (!res.user || !res.user.isAuth) {
        res.pageName = 'exit';
        req.session.redirPage = '/articles';
        next();
    } else {

        var storage = multer.diskStorage({
            destination: function (req, file, callback) {
                callback(null, './public/uploads');
            },
            filename: function (req, file, callback) {
                callback(null, res.user._id + '_' + parseInt((new Date).getTime() / 1000, 10) + '_' + cyrillicToTranslit().transform(file.originalname, "_"));
            },
            fileFilter: function (req, file, cb) {
                if (file.mimetype.substr(0, 5) !== 'image') {
                    return cb('Разрешено загружать только изображения.');
                }

                if (file.size < 5 * 1024 * 1024) {
                    return cb('Разрешено загружать изображения до 5 мегабайт.');
                }

                return cb(null, true);
            }
        });

        var upload = multer({ storage }).single('file');

        upload(req, res, function(err) {
            if (err) {
                return res.end('400', err);
            }

            console.log(req.file);
            res.send('200', JSON.stringify({ location: `/uploads/${req.file.filename}` }));
            return res.end();
        });
    }
});

router.get('*', function(req, res, next) {
    if (!res.pageName) {
        res.send('404', 404);
    } else {
        next();
    }
});

module.exports = router;
