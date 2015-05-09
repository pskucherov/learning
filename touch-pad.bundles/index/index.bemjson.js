({
    block: 'page',
    title: 'Hello, World!',
    styles: [
        { elem: 'css', url: '_index.css' },
        '<!--[if IE]>',
            { elem: 'css', url: '_index.ie.css' },
        '<![endif]-->',
        '<!--[if IE 8]>',
            { elem: 'css', url: '_index.ie8.css' },
        '<![endif]-->',
        '<!--[if IE 9]>',
            { elem: 'css', url: '_index.ie9.css' },
        '<![endif]-->'
    ],
    scripts: [
        { elem: 'js', url: '_index.js' }
    ],
    content: [
        'Hello, World!'
    ]
});
