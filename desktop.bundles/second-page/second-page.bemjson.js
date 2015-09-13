({
    block: 'page',
    js: true,
    title: 'Школьник.com',
    favicon: '/favicon.ico',
    head: [
        { elem: 'meta', attrs: { name: 'description', content: 'Проект, который помогает детям найти взаимопонимание, похвалу и компромисс у родителей.' }},
        {
            elem: 'js',
            content: [
                ';(function(d,e,c,n,w,v,f){',
                'e=d.documentElement;',
                'c="className";',
                'n="createElementNS";',
                'f="firstChild";',
                'w="http://www.w3.org/2000/svg";',
                'e[c]+=" i-ua_svg_"+(!!d[n]&&!!d[n](w,"svg").createSVGRect?"yes":"no");',
                'v=d.createElement("div");',
                'v.innerHTML="<svg/>";',
                'e[c]+=" i-ua_inlinesvg_"+((v[f]&&v[f].namespaceURI)==w?"yes":"no");',
                '})(document);'
            ].join('')
        }
    ],
    mods: { type: 'index' },
    content: [
        {
            block: 'header'
        },
        {
            block: 'second-page',
            attrs: { style: 'width: 500px; height: 500px; background-color: #0f0;' },
            content: [
                'eefffsdf sdeefffsdf sdeefffsdf sdeefffsdf sdeefffsdf sdeefffsdf sdeefffsdf sdeefffsdf sdeefffsdf sd'
            ]
        },
        {
            block: 'footer'
        },
        { elem: 'css', url: '_second-page.css' }
    ],
    scripts: [
        { elem: 'js', url: '_second-page.js' },
    ]
})
