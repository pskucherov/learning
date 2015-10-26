window.vkAsyncInit = function() {
    VK.init({
        apiId: 5076733
    });

    VK.Observer.subscribe('auth.sessionChange', function() {
        VK.Auth.getLoginStatus(window.authInfo);
    });

    window.checkAuthInfo && VK.Auth.getLoginStatus(window.authInfo);
};

window.authInfo || (window.authInfo = function(response) {
    // TODO: выпилить или вынести под debug
    console.log(response);
});
