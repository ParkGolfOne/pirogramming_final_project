function initMap() {
    var mapOptions = {
        center : new naver.maps.LatLng(latitude.innerText, longitude.innerText),
        zoom : 15
    };
    var map = new naver.maps.Map('location_map', mapOptions);

    var markPlace = {
        position : new naver.maps.LatLng(latitude.innerText, longitude.innerText),
        map: map,
        icon: {
            url : "${imageUrl}",
            size : new naver.maps.Size(56, 70),
            anchor : new naver.maps.Point(28, 70),
        }
    };
    var marker = new naver.maps.Marker(markPlace);
}

naver.maps.onJSContentLoaded = initMap;