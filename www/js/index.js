document.addEventListener('deviceready', function() {
    console.log("Device is ready!");
    location.href = "main_screen.html";

    requestGeolocation();

    function requestGeolocation() {
        var options = {
            enableHighAccuracy: true, // Запрос точных геоданных
            timeout: 5000,
            maximumAge: 0
        };

        navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }

    function onSuccess(position) {
        var latitude = position.coords.latitude;
        var longitude = position.coords.longitude;
        console.log("Latitude: " + latitude + ", Longitude: " + longitude);
        alert("Latitude: " + latitude + "\nLongitude: " + longitude);
    }

    function onError(error) {
        console.error("Error code: " + error.code + "\nError message: " + error.message);
        alert("Error code: " + error.code + "\nError message: " + error.message);
    }
}, false);


document.addEventListener('DOMContentLoaded', function() {
    console.log("DOM Content Loaded");
    location.href = "main_screen.html";
});