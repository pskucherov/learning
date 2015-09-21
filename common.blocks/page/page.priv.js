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
                BEMPRIV.create('vk', this.data).json()
            ],
            content: [

                { block: 'header' },

                {
                    block: 'page',
                    elem: 'content',
                    content: BEMPRIV.create(data.pageName, data).json()
                },

                BEMPRIV.create('footer', this.data).json(),

                {
                    elem: 'css',
                    url: '/' + data.pageName + '/_' + data.pageName + '.css'
                }
            ],
            scripts: [
                {
                    elem: 'js',
                    url: '/' + data.pageName + '/_' + data.pageName + '.js',
                    mix: {
                        block: 'page',
                        elem: 'script'
                    }
                }
            ]
        };
};
