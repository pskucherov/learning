({
    block : 'page',
    title : 'Title of the page',
    favicon : '/favicon.ico',
    head : [
        { elem : 'meta', attrs : { name : 'description', content : '' } },
        { elem : 'meta', attrs : { name : 'viewport', content : 'width=device-width, initial-scale=1' } },
        { elem : 'css', url : '_q.css' }
    ],
    scripts: [{ elem : 'js', url : '_q.js' }],
    mods : { theme : 'islands' },
    content: {
        block: 'page',
        elem: 'wrapper',
        content: [
            {
                block: 'class-number',
                content: 1
            },
            {
                block: 'class-number',
                content: 2
            },
            {
                block: 'class-number',
                content: 3
            },
            {
                block: 'class-number',
                content: 4
            },
            {
                block: 'class-number',
                content: 5
            },
            {
                block: 'class-number',
                content: 6
            },
            {
                block: 'class-number',
                content: 7
            },
            {
                block: 'class-number',
                content: 8
            },
            {
                block: 'class-number',
                content: 9
            },
            {
                block: 'class-number',
                content: 10
            },
            {
                block: 'class-number',
                content: 11
            }
        ]
    }
})
