modules.define(
    'page-texts',
    ['i-bem__dom', 'jquery', 'BEMHTML'],
    function(provide, BEMDOM, $, BEMHTML) {

        provide(BEMDOM.decl(this.name, {

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

                return true;
            }
        }));
    }
);
