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

    var htmlMarker1 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/static/locations/images/cluster-marker-1.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker2 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/static/locations/images/cluster-marker-2.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker3 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/static/locations/images/cluster-marker-3.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        },
        htmlMarker4 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/static/locations/images/cluster-marker-4.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        }, 
        htmlMarker5 = {
            content: '<div style="cursor:pointer;width:40px;height:40px;line-height:42px;font-size:10px;color:white;text-align:center;font-weight:bold;background:url(/static/locations/images/cluster-marker-5.png);background-size:contain;"></div>',
            size: N.Size(40, 40),
            anchor: N.Point(20, 20)
        };

    var markerClustering = new MarkerClustering({
        minClusterSize: 2,
        maxZoom: 13,
        map: map,
        markers: markers,
        disableClickZoom: false,
        gridSize: 120,
        icons: [htmlMarker1, htmlMarker2, htmlMarker3, htmlMarker4, htmlMarker5],
        indexGenerator: [10, 100, 200, 500, 1000],
        stylingFunction : function(clusterMarker, count){
             // 클러스터 마커의 DOM을 가져옴
             var element = clusterMarker.getElement();
             // 첫 번째 div 요소를 선택
             var firstChild = element.querySelector('div');
             // 첫번째 요소가 존재할 때 div 요소의 택스트를 마커의 수로 표시
             if(firstChild){
                 firstChild.textContent = count;
                }
            }
        }
    )

    setTimeout(function() {
        document.getElementById('overlay').style.display = 'none';
    }, 100);
}

window.onload = function(){
    get_my_location();
}
