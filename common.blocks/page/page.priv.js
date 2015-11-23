blocks['page'] = function (data) {

    if (!data || !data.pageName) {
        return '404';
    }

    return data.isAjax ? BEMPRIV.create(data.pageName, data).json() :
        {
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
                },
                {
                    elem: 'css',
                    url: '/index/_index.css'
                }
            ],
            content: [
                BEMPRIV.create('header', data).json(),
                {
                    block: 'page',
                    elem: 'content',
                    content: BEMPRIV.create(data.pageName, data).json()
                },
                BEMPRIV.create('footer', data).json()
            ],
            scripts: [
                data.isAuth ? [{
                    elem: 'js',
                    url: '/socket.io/socket.io.js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    }
                },
                {
                    elem: 'js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    },
                    content: 'window.socket = io();'
                }] : '',
                // Для локалхоста берём jquery не из CDN,
                // т.к. может не быть соединения.
                {
                    elem: 'js',
                    url: data.req.headers.host.indexOf('.com') === -1
                        ? '/js/jquery.min.js'
                        : 'https://yastatic.net/jquery/1.8.3/jquery.min.js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    }
                },
                {
                    elem: 'js',
                    url: '/index/_index.js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    }
                }
            ]
        };
};
