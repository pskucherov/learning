var fs = require('fs'),
    PATH = require('path'),
    VM = require('vm'),
    express = require('express'),
    app = express(),
    url = require('url'),
    querystring = require('querystring'),
    Vow = require('vow'),
    pathToBundle = PATH.join('.', 'desktop.bundles', 'index'),
    pathToStatic = PATH.join('.', 'public'),

    ormConnect = require('./ormConnect');

    redirects = require('./routes/redirects');

// html/css/js кэшируем на день, картинки на год.
app.use(express.static(pathToBundle, { maxAge: 86400000 }));
app.use(express.static(pathToStatic, { maxAge: 3153600000000 }));

app.use(redirects);

app.use(ormConnect);

var bemtreeTemplate = fs.readFileSync(PATH.join(pathToBundle, 'index.bemtree.js'), 'utf-8');
var BEMHTML = require(PATH.join('../../' + pathToBundle, 'index.bemhtml.js')).BEMHTML;

var context = VM.createContext({
    console: console,
    Vow: Vow
});

VM.runInContext(bemtreeTemplate, context);
var BEMTREE = context.BEMTREE;

var server = app.listen(3000, function() {
    console.log('Listening on port %d', server.address().port);
});
