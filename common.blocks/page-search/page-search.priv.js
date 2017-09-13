BEMPRIV.decl('page-search', {
    init: function() {
        this.content([
            this._getInput(),
            this._getResult()
        ])
    },

    _getInput: function() {
        return '<div class="ya-site-form ya-site-form_inited_no" onclick="return {\'action\':\'https://schoolnik.com/search\',\'arrow\':false,\'bg\':\'transparent\',\'fontsize\':36,\'fg\':\'#000000\',\'language\':\'ru\',\'logo\':\'rb\',\'publicname\':\'Поиск по школьник.com\',\'suggest\':true,\'target\':\'_self\',\'tld\':\'ru\',\'type\':2,\'usebigdictionary\':true,\'searchid\':2306335,\'input_fg\':\'#000000\',\'input_bg\':\'#ffffff\',\'input_fontStyle\':\'normal\',\'input_fontWeight\':\'normal\',\'input_placeholder\':\'Задайте вопрос\',\'input_placeholderColor\':\'#000000\',\'input_borderColor\':\'#7f9db9\'}"><form action="https://yandex.ru/search/site/" method="get" target="_self" accept-charset="utf-8"><input type="hidden" name="searchid" value="2306335"/><input type="hidden" name="l10n" value="ru"/><input type="hidden" name="reqenc" value="utf-8"/><input type="search" name="text" value=""/><input type="submit" value="Узнать"/></form></div><style type="text/css">.ya-page_js_yes .ya-site-form_inited_no { display: none; }</style><script type="text/javascript">(function(w,d,c){var s=d.createElement(\'script\'),h=d.getElementsByTagName(\'script\')[0],e=d.documentElement;if((\' \'+e.className+\' \').indexOf(\' ya-page_js_yes \')===-1){e.className+=\' ya-page_js_yes\';}s.type=\'text/javascript\';s.async=true;s.charset=\'utf-8\';s.src=(d.location.protocol===\'https:\'?\'https:\':\'http:\')+\'//site.yandex.net/v2.0/js/all.js\';h.parentNode.insertBefore(s,h);(w[c]||(w[c]=[])).push(function(){Ya.Site.Form.init()})})(window,document,\'yandex_site_callbacks\');</script>';
    },

    _getResult: function() {
        return '<div id="ya-site-results" onclick="return {\'tld\': \'ru\',\'language\': \'ru\',\'encoding\': \'utf-8\',\'htmlcss\': \'1.x\',\'updatehash\': true}"></div><script type="text/javascript">(function(w,d,c){var s=d.createElement(\'script\'),h=d.getElementsByTagName(\'script\')[0];s.type=\'text/javascript\';s.async=true;s.charset=\'utf-8\';s.src=(d.location.protocol===\'https:\'?\'https:\':\'http:\')+\'//site.yandex.net/v2.0/js/all.js\';h.parentNode.insertBefore(s,h);(w[c]||(w[c]=[])).push(function(){Ya.Site.Results.init();})})(window,document,\'yandex_site_callbacks\');</script>\n';
    }
});