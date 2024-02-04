// document.addEventListener("DOMContentLoaded", function () {
//   var cityField = document.getElementById("city");
//   var townField = document.getElementById("town");

//   // 1. city 데이터 가져와서 목록으로 뿌림
//   function fetchCityData() {
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "/region/get_city_list/", true);
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState == 4 && xhr.status == 200) {
//         var cityData = JSON.parse(xhr.responseText);
//         populateCityOptions(cityData);
//         console.log("cityData", cityData);
//       }
//     };
//     xhr.send();
//   }

//   // 도시 목록 옵션 업데이트
//   function populateCityOptions(cityData) {
//     cityField.innerHTML = "";
//     var defaultOption = document.createElement("option");
//     defaultOption.value = "";
//     defaultOption.text = "선택해주세요";
//     cityField.appendChild(defaultOption);

//     cityData.forEach(function (city) {
//       var option = document.createElement("option");
//       option.value = city;
//       option.text = city;
//       cityField.appendChild(option);
//     });
//   }

//   fetchCityData();

//   // 선택된 도시에 따라서 동네 목록을 가지고 옴
//   cityField.addEventListener("change", function () {
//     var selectedCity = cityField.value;

//     // Ajax 요청
//     var xhr = new XMLHttpRequest();
//     xhr.open("GET", "/region/get_town_list/?city=" + selectedCity, true);
//     xhr.onreadystatechange = function () {
//       if (xhr.readyState == 4 && xhr.status == 200) {
//         var townData = JSON.parse(xhr.responseText);
//         updateTownField(townData);
//       }
//     };
//     xhr.send();
//   });

//   function updateTownField(townData) {
//     townField.innerHTML = "";

//     // 받아온 town 데이터를 option 태그로 만들어서 추가함
//     townData.forEach(function (town) {
//       var option = document.createElement("option");
//       option.value = town;
//       option.text = town;
//       townField.appendChild(option);
//     });
//   }

//   // 입력 받은 시와 동네를 백엔드로 넘기기
//   // 폼 제출 시 사용할 이벤트 헨들러 추가
//   var form = document.getElementById("signup-form");
//   form.addEventListener("submit", function (event) {
//     event.preventDefault(); // 폼 기본 동작 방지

//     var formData = new FormData(form);
//     formData.append("city", cityField.value);
//     formData.append("town", townField.value);
//     console.log("formData", formData);

//     const url = "/users/signup/";
//     var xhr = new XMLHttpRequest();
//     xhr.open("POST", url, true);
//     xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

//     xhr.onreadystatechange = function () {
//       if (xhr.readyState === XMLHttpRequest.DONE) {
//         if (xhr.status === 200) {
//           var response = JSON.parse(xhr.responseText);
//           if (response.success) {
//             // messageDiv.innerHTML = response.message;
//             console.log("회원가입 성공!");
//             window.location.href = response.url;
//           } else {
//             console.log("회원가입 실패!");
//             // messageDiv.innerHTML = "회원 가입 실패: " + response.message;
//           }
//         } else {
//           console.log("서버 오류 발생!");
//           // messageDiv.innerHTML = "서버 오류가 발생했습니다.";
//         }
//       }
//     };
//     xhr.send(formData);
//   });
// });


// 3. 현이 버전
document.addEventListener("DOMContentLoaded", function () {
  var cityField = document.getElementById("city");
  var townField = document.getElementById("town");

  // 1. city 데이터 가져와서 목록으로 뿌림
  function fetchCityData() {
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/region/get_city_list/", true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var cityData = JSON.parse(xhr.responseText);
        populateCityOptions(cityData);
        console.log("cityData", cityData);
      }
    };
    xhr.send();
  }

  // 도시 목록 옵션 업데이트
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

  // 선택된 도시에 따라서 동네 목록을 가지고 옴
  cityField.addEventListener("change", function () {
    var selectedCity = cityField.value;

    // Ajax 요청
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

  function updateTownField(townData) {
    townField.innerHTML = "";

    // 받아온 town 데이터를 option 태그로 만들어서 추가함
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

    var formData = new FormData(form);
    formData.append("city", cityField.value);
    formData.append("town", townField.value);
    console.log("formData", formData);

    const url = "/users/signup/";
    var xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

    xhr.onreadystatechange = function () {
      if (xhr.readyState === XMLHttpRequest.DONE) {
        if (xhr.status === 200) {
          var response = JSON.parse(xhr.responseText);
          if (response.success) {
            // messageDiv.innerHTML = response.message;
            console.log("회원가입 성공!");
            window.location.href = response.url;
          } else {
            console.log("회원가입 실패!");
            // messageDiv.innerHTML = "회원 가입 실패: " + response.message;
          }
        } else {
          console.log("서버 오류 발생!");
          // messageDiv.innerHTML = "서버 오류가 발생했습니다.";
        }
      }
    };
    xhr.send(formData);
  });
});
