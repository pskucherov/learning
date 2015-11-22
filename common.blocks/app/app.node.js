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

    user = require('./controllers/User'),

    models   = require('./models/'),

    routes = require('./routes/'),

    url = require('url'),
    querystring = require('querystring'),

    http = require('http').Server(app),
    io = require('socket.io')(http),

    SessionSockets = require('session.socket.io'),
    sessionSockets,

    _ = require('lodash'),

    server;

// html/css/js кэшируем на день, картинки на год.
//app.use(express.static(pathToBundle, { maxAge: 86400000 }));

app.use(express.static(PATH.join('.', 'desktop.bundles'), { extensions: ['js', 'css'], maxAge: 86400000 }));

app.use(express.static(pathToStatic, { maxAge: 3153600000000 }));

app.use(myCookieParser);

app.use(session({ secret: _SECRET, store: mySession }));


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

    var content;

    if (res.html) {
        content = res.html;
    } else if (res.priv) {

        //res.user.isAuth = true;

        console.log('session');
        console.log(req.session);
        console.log('cookie');
        console.log(req.cookies);
        console.log('end');

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
            isFemale: res.user.sex == 1
        });

        content = res.BEMHTML.apply(content);
    }

    res.end(content);

});

server = http.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});


models(function (err, db) {
    
    sessionSockets.on('connection', function (err, socket, session) {

        console.log(session);

        var cookie = {},
            interval;
        console.log('connected');

        socket.on('class-select:change', function (classNum) {

            cookie['classNum'] = classNum;

            if (!interval) {
                getTest(cookie.classNum);
                interval = setInterval(function () {
                    getTest(cookie.classNum);
                }, 5000);

                (function (interval) {
                    socket.on('disconnect', function () {
                        console.log('disconnected');
                        clearInterval(interval);
                    });
                })(interval);
            }

        });

        socket.on('s-braint:checkAnswer', function (answerData) {

            db.models['brain-tests'].find({
                id: parseInt(answerData.id, 10),
                rightanswernum: parseInt(answerData.num, 10)
            }).limit(1).run(function (err, data) {
                var isRight = false;

                if (!_.isEmpty(data)) {
                    isRight = true;
                }

                db.models['brain-tests-answers'].create({
                    userId: 123,
                    answerId: answerData.id,
                    answer: isRight
                }, function (err) {
                    if (err) throw err;
                });

                io.emit('s-brain:setAnswer', isRight);
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

            db.models['brain-tests'].find(find).orderRaw('rand()').limit(1).run(function (err, data) {
                !_.isEmpty(data) && io.emit('s-brain:question', data[0]);
            });

        }

    });

});
