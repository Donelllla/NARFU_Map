document.addEventListener('deviceready', function() { // не работает ХЗ как пофиксить(надо тестить на телефоне)
    console.log("Device is ready!");
    document.querySelector('.footer-text').innerHTML = "Успех";
    var ref = cordova.InAppBrowser.open('main_screen.html', '_blank', 'location=no');
}, false);


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded");
    location.href = "main_screen.html";
});