window.location.hostname = window.location.host;

window.vkAsyncInit = function() {
    VK.init({
        apiId: 5076733
    });
    window.authInfo = function(response) {

        console.log(response);

        if (1 == 2 && response.session) {
            alert('user: ' + response.session.mid);

            VK.Api.call('showSettingsBox', 263);

            //VK.Api.call('showSettingsBox', )


            VK.Api.call('account.getAppPermissions', {user_ids: response.session.mid}, function(r) {

                console.log(r);
                /*
                if(r.response) {
                    alert('Привет, ' + r.response[0].first_name);
                }
                */

            });





        }

    };
    VK.Auth.getLoginStatus(authInfo);

    VK.Auth.login(function(response) {

       console.log('VK.Auth.login');
       console.log(response);

    });


        //VK.UI.button('login_button');
};
