// 시, 군/구 선택
var cityField = document.getElementById("city");
var townField = document.getElementById("town");
var sortType = document.getElementById("sortType");

// 1. city 선택 목록 보여주는 기능
// city 데이터 DB에서 요청
function fetchCityData() {
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/region/get_city_list/", true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var cityData = JSON.parse(xhr.responseText);
      populateCityOptions(cityData);
    }
  };
  xhr.send();
}

// 받은 city 데이터를 option 태그로 만들어서 추가함
function populateCityOptions(cityData) {
  cityField.innerHTML = "";
  var defaultOption = document.createElement("option");
  defaultOption.value = "";
  defaultOption.text = "선택해주세요";
  cityField.appendChild(defaultOption);

  cityData.forEach(function (city) {
    var option = document.createElement("option");
    option.value = city;
    option.text = city;
    cityField.appendChild(option);
  });
  findLocation();
}

fetchCityData();

// 2. 선택된 city에 따라 동네 목록을 보여주는 기능
cityField.addEventListener("change", function () {
  var selectedCity = cityField.value;

  // 선택된 city에 따라 동네 목록을 DB에 요청
  var xhr = new XMLHttpRequest();
  xhr.open("GET", "/region/get_town_list/?city=" + selectedCity, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var townData = JSON.parse(xhr.responseText);
      updateTownField(townData);
    }
  };
  xhr.send();
});

// 받아온 town 데이터를 option 태그로 만들어서 추가함
function updateTownField(townData) {
  townField.innerHTML = `<option value="">전체</option>`;

  townData.forEach(function (town) {
    var option = document.createElement("option");
    option.value = town;
    option.text = town;
    townField.appendChild(option);
  });
  findLocation();
}

//////////////// 검색 Area ///////////////////////
// 검색 추가시
const content = document.querySelector(".locationInput");
const match_content = document.querySelector(".location-main-container");

//새 HTTPRequest 생성
// 자동완성 업데이트 부분
const requestFindLocation = new XMLHttpRequest();
// 검색정보 받아오는 리퀘스트
const requestFilterLocation = new XMLHttpRequest();

// 함수명 : findLocation
// 전달인자 : --
// 기능 : 서버에 해당 이름의 장소 있는지 체크
function findLocation() {
  const url = `/search/search_location/`;
  requestFindLocation.open("POST", url, true);
  requestFindLocation.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  match_content.innerHTML = "불러오는 중...";
  requestFindLocation.send(
    JSON.stringify({
      input_text: content.value,
      city: cityField.value,
      town: townField.value,
      sortType: sortType.value,
    })
  );
}

// 장소 검색에 맞게 업데이트 요청 응답 온 후
requestFindLocation.onreadystatechange = () => {
  if (requestFindLocation.readyState === XMLHttpRequest.DONE) {
    if (requestFindLocation.status < 400) {
      const { location_names } = JSON.parse(requestFindLocation.response);
      match_content.innerHTML = "";
      if (location_names.length == 0) {
      } else {
        location_names.forEach((location) => {
          match_content.innerHTML += `
          <div class="location-container">
      <h4>
        <a href="/locations/detail/${location[1]}/"
          >${location[0]}</a
        >
      </h4> 
      <div>추천 ${location[2]}</div>
    </div>`;
        });
      }
    }
  }
};

content.addEventListener("keyup", findLocation);
content.addEventListener("input", findLocation);
