[{
    shouldDeps: [
        {
            block: 'i-fts'
        },
        {
            block : 'suggest',
            mods : {
                theme : 'islands',
                size : 'l',
                'has-dataprovider': 'poems'
            }
        },
        {
            block: 'select-poem',
            tech: 'bemhtml'
        },
        {
            block: 's-speaker-read',
            tech: 'bemhtml'
        },
        {
            block: 's-speaker-sort-lines',
            tech: 'bemhtml'
        },
        {
            block: 'icon'
        },
        {
            block: 'input',
            mods: { 'has-spin': true }
        },
        {
            block: 'input',
            elem: 'spin'
        },
        {
            block : 'spin',
            mods : { theme : 'islands', size : 'xs', visible : true }
        }
    ]
}/*,
{
    tech : 'js',
    mustDeps : { elem: 'select-poem', tech : 'bemhtml' }
}*/]
