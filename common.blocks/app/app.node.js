var fs = require('fs'),
    PATH = require('path'),
    VM = require('vm'),
    express = require('express'),
    app = express(),
    Vow = require('vow'),
    pathToBundle = PATH.join('.', 'desktop.bundles', 'index'),
    pathToStatic = PATH.join('.', 'public'),

    ormConnect = require('./_ormConnect'),

    redirects = require('./routes/redirects'),

    routes = require('./routes/index'),

    url = require('url'),
    querystring = require('querystring'),

    server;

// html/css/js кэшируем на день, картинки на год.
//app.use(express.static(pathToBundle, { maxAge: 86400000 }));

app.use(express.static(PATH.join('.', 'desktop.bundles'), { extensions: ['js', 'css'], maxAge: 86400000 }));

app.use(express.static(pathToStatic, { maxAge: 3153600000000 }));

app.use(ormConnect);

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

        content = res.priv.main({
            pageName: res.pageName,
            searchObj: res.searchObj
        });

        content = res.BEMHTML.apply(content);
    }

    res.end(content);

});

server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
