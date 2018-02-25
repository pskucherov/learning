modules.define(
    'page-texts',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {
            onSetMod: {
                js: {
                    inited: function () {
                        window.socket.on('page-texts:set-article-response', function(res) {
                            this.setMod('hidden', 'yes');
                        }.bind(this));
                    }
                }
            },

            unbindEvents: function() {
                window.socket.removeAllListeners('page-texts:set-article-response');
            },

            _destruct: function() {
                this.unbindEvents();
                this.__base.apply(this, arguments);
            },

            _onSendButtonClick: function() {
                var content = this._getContent();

                if (this._isValidForm(content)) {
                    window.socket.emit('page-texts:set-article', {
                        content: content
                    });
                }
            },

            _getContent: function() {
                return {
                    title: this._getTitle(),
                    keywords: this._getKeywords(),
                    description: this._getDescrition(),
                    text: this._getText()
                };
            },

            _isValidForm: function(content) {
                return true;
            },

            _getTitle: function() {
                return this._getInputText(this.findElem('title-input'));
            },

            _getDescrition: function() {
                return this._getInputText(this.findElem('description-input'));
            },

            _getKeywords: function() {
                return this._getInputText(this.findElem('keywords-input'));
            },

            _getInputText: function(elem) {
                return $(elem).find('.input__control').val();
            },

            _getText: function() {
                return tinyMCE.activeEditor.getContent();
            }
        }, {
            live: function() {
                tinymce.init({
                    selector: '.page-texts textarea',
                    theme: 'modern',
                    width: 600,
                    height: 300,
                    plugins: 'image code preview media table emoticons textcolor',
                    language: 'ru',

                    toolbar: 'insertfile undo redo | styleselect | bold italic | alignleft aligncenter alignright alignjustify | bullist numlist outdent indent | link image | print preview media fullpage | forecolor backcolor code',

                    images_upload_url: '/upload/image'
                });

                this
                    .liveBindTo('send-button', 'pointerclick', function (e) {
                        this._onSendButtonClick(e);
                    });

                return true;
            }
        }));
    }
);
