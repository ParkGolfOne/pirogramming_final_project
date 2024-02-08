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
    console.log(dataArray[data]);
    console.log(data);
    const errorMessagesForField = dataArray[data];
    const inputField = document.querySelector(`[name="${data}"]`);
    console.log(inputField);
    const parentDiv = inputField.parentElement;
    console.log(parentDiv);
    const fieldDiv = parentDiv.querySelector(".errorMessage");
    console.log(fieldDiv);

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

// 입력 받은 점수 정보를 넘기기
// 폼 제출 시 사용할 이벤트 헨들러 추가

parList = document.querySelectorAll(".parInput");
scoreList = document.querySelectorAll(".scoreInput");
// location = document.querySelector(".locationInfo");

var form = document.getElementById("signup-form");
form.addEventListener("submit", function (event) {
  event.preventDefault(); // 폼 기본 동작 방지

  const formData = new FormData(form);
  let i = 0;
  parList.forEach((p) => {
    formData.append(`par${i}`, p.value);
    i += 1;
  });
  i = 0;
  scoreList.forEach((s) => {
    formData.append(`score${i}`, s.value);
    i += 1;
  });
  formData.append("location", location.value);
  const url = "/score/score_input/";
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      if (data.result == "success") {
        window.location.replace(data.url);
      } else {
        errorMessage(data.error);
      }
    }
  };

  xhr.send(formData);
});
