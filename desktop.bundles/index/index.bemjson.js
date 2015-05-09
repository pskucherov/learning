({
    block: 'page',
    title: 'Школьник.com',
    favicon: '/favicon.ico',
    head: [
        { elem: 'meta', attrs: { name: 'description', content: 'Проект, который помогает найти детям взаимопонимание, похвалу и компромисс с родителями.' }},
        { elem: 'css', url: '_index.css' }
    ],
    content: [
        {
            block: 'header'
        },
        {
            block: 'main'
        },
        {
            block: 'footer'
        }
    ],
    scripts: [{ elem: 'js', url: '_index.js' }]
})
