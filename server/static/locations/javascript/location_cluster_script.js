// function initMap() {
//     var mapOptions = {
//         center : new naver.maps.LatLng(37.3595704, 127.105399),
//         zoom : 15
//     };
//     var map = new naver.maps.Map('location_map', mapOptions);

//     var markPlace = {
//         position : new naver.maps.LatLng(37.3595704, 127.105399),
//         map: map,
//     };
//     var marker = new naver.maps.Marker(markPlace);
// }
function get_my_location() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

//내 위치를 찾는 위 함수의 콜백함수 -> 나의 현재위치를 지도에 표시해줌
function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    var mapOptions = {
        center : new naver.maps.LatLng(latitude, longitude),
        zoom : 15
    };
    var map = new naver.maps.Map('location_map', mapOptions);

    var bounds = new naver.maps.LatLngBounds();

    var myLocation = new naver.maps.LatLng(latitude, longitude);

    var markPlace = {
        position : myLocation,
        map: map,
        //나의 위치와 골프장의 위치 마커를 구분하기 위해 빨간색 원으로 나의 위치를 표시함
        icon : {
            content : '<div style="width: 14px; height: 14px; background-color: red; border: 2px solid #fff; border-radius: 50%;"></div>',
            anchor : new naver.maps.Point(7,7),
        }
    };
    var myMarker = new naver.maps.Marker(markPlace);

    bounds.extend(myLocation);

    var markers = []; //골프장 객체들을 찍을 마커를 저장하는 빈 배열 선언

    //json 형태로 온 모든 골프장 객체의 좌표를 마커로 찍기
    locations_list.map(item => {
        const golfLat = item[1];
        const golfLon = item[2];
        const markerLocations = new naver.maps.LatLng(golfLat, golfLon);

        const marker = new naver.maps.Marker({
            position : markerLocations,
            map: map,
        });

        markers.push(marker);
        bounds.extend(markerLocations);
    });
    
    //모든 마커가 보일 수 있도록 지도 zoom 뷰 조절
    map.fitBounds(bounds);
    console.log(markers);
}

get_my_location();