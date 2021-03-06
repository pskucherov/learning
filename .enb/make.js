var techs = {
        fileMerge: require('enb/techs/file-merge'),
        // css
        stylus: require('enb-stylus/techs/stylus'),
        // js
        browserJs: require('enb-js/techs/browser-js'),
        // bemhtml
        bemhtml: require('enb-bemxjst/techs/bemhtml')
    },
    enbBemTechs = require('enb-bem-techs'),
    borschikTech = require('enb-borschik/techs/borschik'),
    isProd = process.env.YENV !== 'dev';

console.log(process.env.YENV);
console.log(process.env.YENV !== 'dev');

module.exports = function (config) {

    var mask = /.*.bundles\/[^(index)]/;

    /*
    config.nodes('*.bundles/*');

    config.nodeMask(mask, function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [require('enb/techs/file-provider'), { target: '?.bemjson.js' }],
            [enbBemTechs.files],
            [enbBemTechs.deps],
            [enbBemTechs.bemjsonToBemdecl],

            // priv.js
            [ require('enb-priv-js/techs/priv-js'), { freezeableTechs: ['_?.css', '_?.js'] } ],
            [ borschikTech, { freeze: true, minify: false, sourceTarget: '?.priv.js', destTarget: '_?.priv.js' } ],

            // bemhtml
            [require('enb-bemxjst/techs/bemhtml-old'), { devMode: !isProd }],

            // client bemhtml
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.bemhtml.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.bemhtml.deps.js',
                bemdeclFile: '?.bemhtml.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.bemhtml.deps.js',
                filesTarget: '?.bemhtml.files',
                dirsTarget: '?.bemhtml.dirs'
            }],
            [require('enb-bemxjst/techs/bemhtml-old'), {
                target: '?.browser.bemhtml.js',
                filesTarget: '?.bemhtml.files',
                devMode: process.env.BEMHTML_ENV === 'development'
            }],

            [borschikTech, { sourceTarget: '?.bemhtml.js', destTarget: '_?.bemhtml.js', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets([
            '_?.bemhtml.js',
            '_?.priv.js'
        ]);
    });
    */

    config.nodeMask(mask, function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getDesktops(config) }]
        ]);
    });

    config.nodes('*.bundles/index', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [require('enb/techs/file-provider'), { target: '?.bemjson.js' }],
            [enbBemTechs.files],
            [enbBemTechs.deps],
            [enbBemTechs.bemjsonToBemdecl],

            // priv.js
            [ require('enb-priv-js/techs/priv-js'), { freezeableTechs: ['_?.css', '_?.js'] } ],
            [ borschikTech, { freeze: true, minify: false, sourceTarget: '?.priv.js', destTarget: '_?.priv.js' } ],

            // css
            //[require('enb-stylus/techs/css-stylus'), { target: '?.noprefix.css' }],

            // browser.js

            [techs.browserJs, { target: '?.browser.js' }],

            // Сейчас в JS на клиент тянется весь BEMHTML,
            // чтобы норм работали аякспереходы и не особо заморачиваться с депсами
            // в идеале, надо каждый шаблон добавлять на клиент по надобности, но есть ощущение, что в итоге
            // на клиент приедет большая часть шаблонов и профит будет минимальный.
            [require('enb/techs/file-merge'), {
                target: '?.pre.js',
                sources: ['?.bemhtml.js', '?.browser.js']
            }],

            [require('enb-modules/techs/prepend-modules'), {
                source: '?.pre.js',
                target: '?.js'
            }],


            // js
           /* [techs.browserJs],
            [techs.fileMerge, {
                target: '?.js',
                sources: ['?.browser.js']//, '?.browser.bemhtml.js']
            }],
            */


            // css
            [techs.stylus, {
                target: '?.css',
                sourcemap: false,
                autoprefixer: {
                    browsers: ['ie >= 10', 'last 2 versions', 'opera 12.1', '> 2%']
                }
            }],


            // bemhtml
            //[require('enb-bemxjst/techs/bemhtml-old'), { devMode: !isProd }],
            [techs.bemhtml, { sourceSuffixes: ['bemhtml', 'bemhtml.js'] }],

            // client bemhtml
            [enbBemTechs.depsByTechToBemdecl, {
                target: '?.bemhtml.bemdecl.js',
                sourceTech: 'js',
                destTech: 'bemhtml'
            }],
            [enbBemTechs.deps, {
                target: '?.bemhtml.deps.js',
                bemdeclFile: '?.bemhtml.bemdecl.js'
            }],
            [enbBemTechs.files, {
                depsFile: '?.bemhtml.deps.js',
                filesTarget: '?.bemhtml.files',
                dirsTarget: '?.bemhtml.dirs'
            }],

            /*
            [require('enb-bemxjst/techs/bemhtml-old'), {
                target: '?.browser.bemhtml.js',
                filesTarget: '?.bemhtml.files',
                devMode: process.env.BEMHTML_ENV === 'development'
            }],
            */

            // borschik
            [borschikTech, { sourceTarget: '?.css', destTarget: '_?.css', tech: 'cleancss', freeze: true, minify: isProd }],
            //[borschikTech, { sourceTarget: '?.ie.css', destTarget: '_?.ie.css', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.js', destTarget: '_?.js', freeze: true, minify: isProd }],
            [borschikTech, { sourceTarget: '?.bemhtml.js', destTarget: '_?.bemhtml.js', freeze: true, minify: isProd }]
        ]);

        nodeConfig.addTargets([
            '_?.css',
            //'_?.ie.css',
            '_?.js',
            '_?.bemhtml.js',
            '_?.priv.js'
        ]);
    });

    config.nodes('*.bundles/index', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getDesktops(config) }],

            /*
            // autoprefixer
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                browserSupport: ['last 2 versions', 'ie 10', 'ff 24', 'opera 12.16'],
                sourceTarget: '?.noprefix.css'
            }]
            */
        ]);
    });

    /*
    config.nodes('*touch-pad.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getTouchPads(config) }],
            // autoprefixer
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                browserSupport: ['android 4', 'ios 5'],
                sourceTarget: '?.noprefix.css'
            }]
        ]);
    });

    config.nodes('*touch-phone.bundles/*', function (nodeConfig) {
        nodeConfig.addTechs([
            // essential
            [enbBemTechs.levels, { levels: getTouchPhones(config) }],
            // autoprefixer
            [require('enb-autoprefixer/techs/css-autoprefixer'), {
                browserSupport: ['android 4', 'ios 6', 'ie 10'],
                sourceTarget: '?.noprefix.css'
            }]
        ]);
    });
    */

};

function getDesktops(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/desktop.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/desktop.blocks', check: false },
        { path: 'libs/bem-components/design/desktop.blocks', check: false },
        { path: 'libs/bem-suggest/blocks', check: false },
        { path: 'libs/bem-priv/build/blocks', check: false },
        'common.blocks',
        'desktop.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}

/*
function getTouchPads(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/touch.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch-pad.blocks', check: false },
        'common.blocks',
        'touch.blocks',
        'touch-pad.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}

function getTouchPhones(config) {
    return [
        { path: 'libs/bem-core/common.blocks', check: false },
        { path: 'libs/bem-core/touch.blocks', check: false },
        { path: 'libs/bem-components/common.blocks', check: false },
        { path: 'libs/bem-components/design/common.blocks', check: false },
        { path: 'libs/bem-components/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch.blocks', check: false },
        { path: 'libs/bem-components/design/touch-phone.blocks', check: false },
        'common.blocks',
        'touch.blocks',
        'touch-phone.blocks'
    ].map(function (level) {
        return config.resolvePath(level);
    });
}
*/
