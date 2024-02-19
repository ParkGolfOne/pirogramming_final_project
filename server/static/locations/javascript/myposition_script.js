//아래 함수에서 return한 두 배열을 하나의 배열로 묶어주기 -> 이로써 거리를 해당 골프장 이름, 좌표와 매칭시킬 수 있음 -> 거리를 정렬하면 그에 맞게 골프장 정보도 정렬
function combineArrays(distances, positions_list){
    const roundedDistances = distances.map(item => item.toFixed(2)); //계산된 거리를 소수 2자리 수로 반올림 해버리기
    return positions_list.map((item, index) => [roundedDistances[index], item]);
}

function myplace_nearest_golf(){
    const distances = [];

    for (let i = 0 ; i < positions_list.length ; i++){
        const r = 6372; // 지구의 반지름이라내요
        const element = positions_list[i];
        const lat1 = latitude * Math.PI / 180;
        const lon1 = longitude * Math.PI / 180;
        const lat2 = element[1] * Math.PI / 180;
        const lon2 = element[2] * Math.PI / 180;

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

    //뷰에서 넘겨준 모든 골프장 객체와 해당 골프장과 나의 현재 거리를 배열로 return
    return {
        distances : distances, 
        positions_list : positions_list,
    }

}


function get_my_location() {
    if (navigator.geolocation){
        navigator.geolocation.getCurrentPosition(showPosition);
    }
}

//내 위치를 찾는 위 함수의 콜백함수 -> 나의 현재위치를 지도에 표시해줌 + 나의 위치를 latitude와 longitude 변수에 할당하여 myplace_nearest_golf 함수에 넘겨줌
function showPosition(position) {
    latitude = position.coords.latitude;
    longitude = position.coords.longitude;

    var mapOptions = {
        center : new naver.maps.LatLng(latitude, longitude),
        zoom : 15
    };
    var map = new naver.maps.Map('myposition_map', mapOptions);

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
    var marker = new naver.maps.Marker(markPlace);

    bounds.extend(myLocation);
    
    //위에서 정의한 함수들을 실행 -> 나의 위치를 찾아 변수에 할당 -> 각 골프장 객체와 거리 계산 -> 거리와 매칭되는 골프장 정보를 2차원 배열에 묶기
    const distance_data = myplace_nearest_golf();
    const combined_data = combineArrays(distance_data.distances, distance_data.positions_list);

    // 2차원 배열의 첫번째 요소(거리)를 기준으로 오름차순 정렬
    const organized_data = combined_data.sort((a, b) => a[0] - b[0]);

    //가장 거리가 작은 (가까운) 5개의 요소만 최종적으로 저장
    const final_five = organized_data.slice(0,5);

    console.log(final_five);

    var infoWindow = new naver.maps.InfoWindow({
        maxWidth: 200,
        backgroundColor: "#eee",
        borderColor: "#2db400",
        borderWidth: 5,
        anchorSize: new naver.maps.Size(10, 10),
        anchorSkew: false,
        anchorColor: "#eee",
        pixelOffset: new naver.maps.Point(20, -20)
    });
    
    final_five.map(item => {
        const golfLat = item[1][1];
        const golfLon = item[1][2];
        const markerPositions = new naver.maps.LatLng(golfLat, golfLon);

        const marker = new naver.maps.Marker({
            position : markerPositions,
            map: map,
        });
        bounds.extend(markerPositions);

        naver.maps.Event.addListener(marker, 'mouseover', function(e){
            infoWindow.setContent('<div style="width:150px;text-align:center;padding:10px;">' + item[1][0] + '</div>');
            infoWindow.open(map, marker);
        });

        naver.maps.Event.addListener(marker, 'mouseout', function(e){
            infoWindow.close();
        });

        naver.maps.Event.addListener(marker, 'click', function(){

            //window.location.href = `https://map.naver.com/p/search/${item[0]}`;  -> 같은 창에서 그대로 지도 검색
            
            window.open(`https://map.naver.com/p/search/${item[1][0]}`);  // 새로운 창에서 지도 검색
        });
    });
    
    //모든 마커가 보일 수 있도록 지도 zoom 뷰 조절
    map.fitBounds(bounds);

    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
    }, 100);
};

get_my_location()

