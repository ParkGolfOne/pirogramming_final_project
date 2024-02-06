function get_my_location() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    var latitude = position.coords.latitude
    var longitude = position.coords.longitude

    var mapOptions = {
        center : new naver.maps.LatLng(latitude, longitude),
        zoom : 15
    };
    var map = new naver.maps.Map('myposition_map', mapOptions);

    var markPlace = {
        position : new naver.maps.LatLng(latitude, longitude),
        map: map,
        icon: {
            url : "${imageUrl}",
            size : new naver.maps.Size(56, 70),
            anchor : new naver.maps.Point(28, 70),
        }
    };
    var marker = new naver.maps.Marker(markPlace);
}
get_my_location;