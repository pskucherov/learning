var vow = require('enb/node_modules/vow'),
    _ = require('lodash'),
    path = require('path'),
    fs = require('fs'),
    bempriv = require('bem-priv');

var vow = require('enb/node_modules/vow/lib/vow');


module.exports = require('enb/lib/build-flow').create()
    .name('bempriv')
    .target('target', '?.bemjson.js')
    .useFileList('priv.js')
    .builder(function (sourceFiles) {
        var node = this.node;
        return Vow.all(sourceFiles.map(function (file) {
            return 'require(\'' + node.relativePath(file.fullname).replace(relativePath, '') + '\');';
        })).then(function (res) {
            return res.join('\n');
        });
    })
    .createTech();




    /*.defineRequiredOption('sourceTarget')
    .useSourceText('sourceFilename', '{sourceTarget}')
    .defineRequiredOption('destTarget')
    .target('destTarget', '?.destTarget')
    .builder(function(source) {

        var node = this.node,
            target = this._target,
            cache = node.getNodeCache(target),
            bemdeclFilename = node.resolvePath(target),
            bemjsonFilename = node.resolvePath(this._sourceTarget);

        return this.node.requireSources([this._sourceTarget])
            .then(function (source) {

                console.log(source );

                return 'bempriv qwe';

            });



        //console.log(source);

        /*
        var node = this.node;
        return Vow.all(sourceFiles.map(function (file) {
            return 'require(\'' + node.relativePath(file.fullname).replace(relativePath, '') + '\');';
        })).then(function (res) {
            return res.join('\n');
        });

        /*

        var commonPath = this.node.resolvePath(''),
            promise;

        this.node.getLogger().log('Calm down, SVG spriter is running...');

        console.log(bempriv);

        return 'qwe';

        var q = readAll([header].concat(testSourceFiles)).then(concat);
        */
/*
    })
    .createTech();
*/
