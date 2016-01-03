var fs = require('fs'),
    PATH = require('path'),
    VM = require('vm'),
    express = require('express'),
    app = express(),
    Vow = require('vow'),
    pathToBundle = PATH.join('.', 'desktop.bundles', 'index'),
    pathToStatic = PATH.join('.', 'public'),

    session = require('express-session'),
    _SECRET = 'nosecret',
    mySession = new session.MemoryStore(),

    cookieParser = require('cookie-parser'),
    myCookieParser = cookieParser(_SECRET),

    redirects = require('./routes/redirects'),

    User = require('./controllers/User'),
    BrainTests = require('./controllers/BrainTests'),
    Complaints = require('./controllers/Complaints'),
    Poems = require('./controllers/Poems'),

    settings = require('./settings'),

    models   = require('./models/'),

    routes = require('./routes/'),

    url = require('url'),
    querystring = require('querystring'),

    http = require('http').Server(app),
    io = require('socket.io')(http),

    SessionSockets = require('session.socket.io'),
    sessionSockets,

    orm = require('orm'),

    _ = require('lodash'),

    bodyParser = require("body-parser"),

    server;

// html/css/js кэшируем на день, картинки на год.
//app.use(express.static(pathToBundle, { maxAge: 86400000 }));

app.use(express.static(PATH.join('.', 'desktop.bundles'), { extensions: ['js', 'css'], maxAge: 86400000 }));
app.use(express.static(pathToStatic, { maxAge: 3153600000000 }));

app.use(myCookieParser);
app.use(session({ secret: _SECRET, store: mySession }));

app.use(bodyParser.urlencoded({ extended: false }));


sessionSockets = new SessionSockets(io, mySession, myCookieParser);



// По мотивам: https://github.com/dresende/node-orm2/issues/524
// https://github.com/dresende/node-orm2/blob/master/examples/anontxt/config/environment.js#L12-L21
app.use(function (req, res, next) {
    models(function (err, db) {
        if (err) return next(err);

        req.models = db.models;
        req.db     = db;

        return next();
    });
});

app.use(redirects);

var context = VM.createContext({
    console: console,
    Vow: Vow
});

app.use(routes, function(req, res) {

    res.searchObj = url.parse(req.url, true).query;
    res.user || (res.user = {});

    var content;

    res.isAjax = res.searchObj && (res.searchObj.format === 'json' || res.searchObj.ajax === 'yes');

    if (res.html) {
        content = res.html;
    } else if (res.priv) {

        //res.user.isAuth = true;

        _.assign(req.session, req.cookies);

        content = res.priv.main({
            pageName: res.pageName,
            searchObj: res.searchObj,
            cookies: req.cookies,
            session: req.session,
            user: res.user,
            appId: res.appId || 0,
            req: req,
            res: res,
            isAuth: res.user.isAuth,
            isFemale: res.user.sex == 1,
            isAjax: res.isAjax
        });

        if (res.isAjax) {
            res.set('Content-Type', 'application/json');
        } else {
            res.set('Content-Type', 'text/html');
            content = res.BEMHTML.apply(content);
        }

        res.send(content);
        content = '';

    }

    res.end(content);

});

server = http.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});


models(function (err, db) {

    sessionSockets.on('connection', function(err, socket, session) {
        console.log('connected');

        socket.on('disconnect', function() {
            console.log('disconnected');
        });

        var sid = session && session[settings.vk.cookieName];

        if (!sid) {
            return;
        }

        var user = new User(db.models['users'], { sid: sid }, function() {

            if (!user || !user.id) {
                user = {};
                return;
            }

            /* DATA-PROVIDER START */

            socket.on('provider:act:find-author', function (query) {
                Poems.findAuthorByQuery(db.models['authors'], query)
                    .then(function (authors) {
                        socket.emit('provider:data:author', authors);
                    });
            });

            socket.on('provider:act:find-poem', function (query, author) {
                Poems.findPoemByAuthorANDQuery(db.models['poems'], query, author)
                    .then(function(poems) {
                        socket.emit('provider:data:poem', poems);
                    });
            });
            //window.socket.emit('provider:act:' + params.act, params.val);


            /* DATA-PROVIDER END */



            /* LANDING START */

            db.models['brain-tests-answers'].count({userId: user.id, answer: 1}, function (err, rightAnswers) {
                db.models['brain-tests-answers'].count({userId: user.id}, function (err, answers) {
                    socket.emit('user:rating', {
                        0: {
                            countAnswers: answers,
                            rightAnswers: rightAnswers
                        }
                    });
                });
            });

            /* LANDING END */


            /* S-SPEAKER START */

            socket.on('s-speaker:get-poem', function (poemId) {
                Poems.getPoemById(db.models['poems'], poemId)
                    .then(function (poem) {
                        socket.emit('s-speaker:poem', poem);
                    });
            });

            /* S-SPEAKER END */

            /* SELECT-POEM START */

            socket.on('select-poem:getPoemByNameAndAuthor', function (params) {
                Poems.getPoemByNameAndAuthor(db.models['poems'], params.name, params.author)
                    .then(function (poem) {
                        socket.emit('select-poem:getPoemByNameAndAuthor', poem);
                    });
            });

            /* SELECT-POEM END */


            /* BRAIN-TEST START */

            var cookie = {},
                rating = {};

            socket.on('class-select:change', function (classNum) {
                cookie['classNum'] = classNum;
                getTest(cookie.classNum);
            });

            socket.on('s-braint:nextQuestion', function () {
                getTest(cookie.classNum);
            });

            socket.on('s-braint:checkAnswer', function (answerData) {

                db.models['brain-tests'].find({
                    id: parseInt(answerData.id, 10),
                    rightanswernum: parseInt(answerData.num, 10)
                }).limit(1).run(function (err, data) {
                    var isRight = false;

                    if (!_.isEmpty(data)) {
                        isRight = true;

                        db.models['brain-tests-answers'].count({
                            userId: user.id,
                            answer: 1
                        }, function (err, rightAnswers) {
                            db.models['brain-tests-answers'].count({userId: user.id}, function (err, answers) {
                                socket.emit('user:rating', {
                                    0: {
                                        countAnswers: answers,
                                        rightAnswers: rightAnswers
                                    }
                                });
                            });
                        });

                    }

                    BrainTests.createAnswerRow(db.models['brain-tests-answers'], user.id, answerData.id, isRight)
                        .then(function () {
                            socket.emit('s-brain:setAnswer', isRight);
                        });
                });

            });

            function getTest(classNum) {
                var find = {};

                if (!classNum) {
                    classNum = cookie['classNum'];
                }

                if (classNum) {
                    classNum = parseInt(classNum, 10);
                    classNum >= 1 && classNum <= 11 && (find.class = classNum);
                }

                BrainTests.getUserForStat(db, user.id, classNum).then(function (data) {
                    socket.emit('rating:rating', data);
                });

                BrainTests.getRandomQuestionForUser(db.models['brain-tests'], user.id, classNum)
                    .then(function (data) {
                        socket.emit('s-brain:question', data);
                    })
                    .fail(function () {


                        BrainTests.getStatsForUserClass(db.models['brain-tests-answers'], user.id, find.class, 1)
                            .then(function (rightAnswers) {
                                BrainTests.getStatsForUserClass(db.models['brain-tests-answers'], user.id, find.class, 0)
                                    .then(function (falseAnswers) {
                                        socket.emit('s-brain:question-end', {
                                            rightAnswers: rightAnswers,
                                            falseAnswers: falseAnswers
                                        });
                                    });
                            });


                    });

            }

            /* BRAIN-TEST END */

        });

    });

});
