document.addEventListener('deviceready', function() {
    console.log("Device is ready!");
    document.querySelector('.footer-text').innerHTML = "Успех";
    location.href = "main_screen.html";
}, false);


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded");
    location.href = "main_screen.html";
});