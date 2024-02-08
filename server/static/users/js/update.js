document.addEventListener("DOMContentLoaded", function () {
  var cityField = document.getElementById("city");
  var townField = document.getElementById("town");
  var addressField = document.getElementById("address_text");
  var sbAddressField = document.getElementById("address_detail");


  // 1. city 선택 목록 보여주는 기능
  // city 데이터 DB에서 요청
  // signup 과 다른 점은 default로 보여주는 값이 유저의 기존 데이터로 설정 됨
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

   function errorMessage(dataArray) {
     // 기존 에러 메세지 삭제
     var errorElements = document.querySelectorAll(".errorMessage");
     errorElements.forEach(function (element) {
       element.innerHTML = "";
     });
     var elements = document.querySelectorAll(".error-input");
     elements.forEach(function (element) {
       if (element) {
         element.classList.remove("error-input");
       }
     });

     // 각 필드에 대한 오류 메시지 추가
     Object.keys(dataArray).forEach((data) => {
       const errorMessagesForField = dataArray[data];
       const inputField = document.querySelector(`[name="${data}"]`);
       const parentDiv = inputField.parentElement;
       const fieldDiv = parentDiv.querySelector(".errorMessage");

       // 해당 필드에 오류 메시지가 있는 경우에만 처리
       if (errorMessagesForField.length > 0) {
         const errorMessageElement = document.createElement("p");
         errorMessageElement.textContent = errorMessagesForField[0]; // 첫 번째 오류 메시지만 표시
         fieldDiv.appendChild(errorMessageElement);
         fieldDiv.classList.add("error-text");

         // 필드 강조 표시 등 추가적인 UI 변경도 가능
         inputField.classList.add("error-input");
       }
     });
   }

  // 입력 받은 시와 동네를 백엔드로 넘기기
  // 폼 제출 시 사용할 이벤트 헨들러 추가
  var form = document.getElementById("update-form");
  form.addEventListener("submit", function (event) {
    event.preventDefault(); // 폼 기본 동작 방지
    
    // form 데이터 가져옴
    const formData = new FormData(form);

    // city 수정이 없는경우 - 기존의 값으로 설정
    if (cityField.value === "") {
      const selectedOption1 = cityField.options[0];
      const selectedValue1 = selectedOption1.innerHTML;
      formData.append("city", selectedValue1);
    } else {
      formData.append("city", cityField.value);
    }
    // town 수정이 없는경우 - 기존의 값으로 설정
    if (townField.value === "") {
      const selectedOption2 = townField.options[0];
      const selectedValue2 = selectedOption2.text;
      formData.append("town", selectedValue2);
    } else {
      formData.append("town", townField.value);
    }
      
    formData.append("street_address", addressField.value);
    formData.append("detail_address", sbAddressField.value);
    
    const url = `/users/update/${userId}/`;
    const xhr = new XMLHttpRequest();
    xhr.open("POST", url, true);
    xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");
    xhr.onreadystatechange = function () {
      if (xhr.readyState === 4 && xhr.status === 200) {
        const data = JSON.parse(xhr.responseText);
        if (data.result == "success")  {
          window.location.replace(data.url);
        }
        else {errorMessage(data.error);}
      }
    };
    xhr.send(formData);
  });
});

function execDaumPostcode(event) {
  event.preventDefault();
  new daum.Postcode({
    oncomplete: function (data) {
      var address = "";

      if (data.userSelectedType === "R") {
        address = data.roadAddress;
      } else {
        address = data.jibunAddress;
      }

      document.getElementById("address_text").value = address;
      document.getElementById("address_detail").focus(); // 커서를 상세주소 필드로 이동
    },
  }).open();
}
