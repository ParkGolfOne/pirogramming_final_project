function initMap() {
    console.log(longitude.innerText);
    console.log(latitude.innerText);


    var mapOptions = {
        center : new naver.maps.LatLng(latitude.innerText, longitude.innerText),
        zoom : 15
    };
    var map = new naver.maps.Map('location_map', mapOptions);

    var markPlace = {
        position : new naver.maps.LatLng(latitude.innerText, longitude.innerText),
        map: map,
        icon: {
            content: `
                <div style="display: flex; flex-direction: column; align-items: center;"> 
                    <div style=" position: relative; z-index: 2; display: flex; justify-content: center; align-items: center; ">
                        <img src="${imageUrl}" style="width: 50px; height: 50px; background-color: white; border-radius: 50%; border: 3px solid black;">
                    </div>
                    <div style="position: absolute; z-index: 1; width: 0; height: 0; border-left: 10px solid transparent; border-right: 10px solid transparent; border-top: 20px solid black; top: 45px; opacity: 0.8;"></div>
                </div>
            `
        }
    };
    var marker = new naver.maps.Marker(markPlace);
}

naver.maps.onJSContentLoaded = initMap;