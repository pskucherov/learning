var fs = require('fs'),
    PATH = require('path'),
    VM = require('vm'),
    express = require('express'),
    app = express(),
    Vow = require('vow'),
    pathToBundle = PATH.join('.', 'desktop.bundles', 'index'),
    pathToStatic = PATH.join('.', 'public'),

    session = require('express-session'),

    cookieParser = require('cookie-parser'),

    redirects = require('./routes/redirects'),

    user = require('./controllers/User'),

    models   = require('./models/'),

    routes = require('./routes/'),

    url = require('url'),
    querystring = require('querystring'),

    http = require('http').Server(app),
    io = require('socket.io')(http),

    _ = require('lodash'),

    server;

// html/css/js кэшируем на день, картинки на год.
//app.use(express.static(pathToBundle, { maxAge: 86400000 }));

app.use(express.static(PATH.join('.', 'desktop.bundles'), { extensions: ['js', 'css'], maxAge: 86400000 }));

app.use(express.static(pathToStatic, { maxAge: 3153600000000 }));

app.use(cookieParser());

app.use(session({ secret: 'nosecret' }));

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

    io.on('connection', function(socket){

        console.log('connected');

        setInterval(function() {
            req.models['brain-tests'].find().orderRaw('rand()').limit(1).run(function(err, data) {
                !_.isEmpty(data) && io.emit('s-brain:question', data[0]);
            });
        }, 5000);

    });



    if (res.html) {
        content = res.html;
    } else if (res.priv) {

        //res.user.isAuth = true;

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
