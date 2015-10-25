window.vkAsyncInit = function() {
    VK.init({
        apiId: 5076733
    });


    VK.Observer.subscribe('auth.sessionChange', function() {
        VK.Auth.getLoginStatus(window.authInfo);
    });

    window.checkAuthInfo && VK.Auth.getLoginStatus(authInfo);
    /*
    if (window.needVKLogin) {
        VK.Auth.login(window.vkLogin);
    } else {
        VK.Auth.getLoginStatus(authInfo);
    }
    */
};




/*
window.vkLogin || (window.vkLogin = function(response) {

});
*/

window.authInfo || (window.authInfo = function(response) {

    console.log(response);

    if (1 == 2 && response.session) {
        alert('user: ' + response.session.mid);

        VK.Api.call('showSettingsBox', 263);

        //VK.Api.call('showSettingsBox', )


        VK.Api.call('account.getAppPermissions', {user_ids: response.session.mid}, function(r) {
            console.log(r);
        });

    }

});


