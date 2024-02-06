function get_my_location() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude
    var longitude = position.coords.longitude

    console.log(latitude)
    console.log(longitude)

    var mapOptions = {
        center : new naver.maps.LatLng(latitude, longitude),
        zoom : 15
    };
    var map = new naver.maps.Map('myposition_map', mapOptions);

    var markPlace = {
        position : new naver.maps.LatLng(latitude, longitude),
        map: map,
    };
    var marker = new naver.maps.Marker(markPlace);
}
naver.maps.onJSContentLoaded = get_my_location;