document.addEventListener("DOMContentLoaded", function () {
  var cityField = document.getElementById("city");
  var townField = document.getElementById("town");

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
    townField.innerHTML = "";

    townData.forEach(function (town) {
      var option = document.createElement("option");
      option.value = town;
      option.text = town;
      townField.appendChild(option);
    });
  }

  // 입력 받은 시와 동네를 백엔드로 넘기기
  // 폼 제출 시 사용할 이벤트 헨들러 추가
  var form = document.getElementById("signup-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 기본 동작 방지

    const formData = new FormData(form);
    formData.append("city", cityField.value);
    formData.append("town", townField.value);

    const url = "/users/signup/";
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.send(formData);
  });
});
