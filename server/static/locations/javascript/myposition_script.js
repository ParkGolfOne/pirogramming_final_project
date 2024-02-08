var latitude = 0;
var longitude = 0;
var position_list = document.getElementById('position_list').innerText;

function get_my_location() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    console.log(latitude);
    console.log(longitude);

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

function myplace_nearest_golf(){
    const distances = [];
    for (let i = 0 ; i < position_list.length ; i++){
        const r = 6372; // 지구의 반지름이라내요
        const element = position_list[i];
        const lat1 = latitude * Math.PI / 180;
        const lon1 = longitude * Math.PI / 180;
        const lat2 = element[0] * Math.PI / 180;
        const lon2 = element[1] * Math.PI / 180;

        const diffLat = lat2 - lat1; 
        const diffLon = lon2 - lon1; 

        // 헤버사인 공식 사용
        const a = Math.sin(diffLat / 2) * Math.sin(diffLat / 2) +
                  Math.cos(lat1) * Math.cos(lat2) *
                  Math.sin(diffLon / 2) * Math.sin(diffLon / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
        const distance = r * c;

        distances.push(distance); // 거리 반환후 배열 distances에 추가해주기
    }
    return distances;

}

console.log(latitude);
console.log(longitude);
naver.maps.onJSContentLoaded = get_my_location;
const list = myplace_nearest_golf();
console.log(list);