const locationInput = document.querySelector(".locationInputArea");
const scoreSubmitBtn = document.querySelector(".scoreSubmitBtn");
//초기 세팅
scoreSubmitBtn.disabled = true;
scoreSubmitBtn.innerText = "올바른 골프장 이름을 입력 바랍니다.";

function changeLocationInput() {
  locationInput.innerHTML = `<span>장소 검색 : </span>
    <input class="locationInput locationInfo" type="text" name="location" />
    <!-- 알맞는 데이터 없을 시   -->
    <div class="matchLocation"></div>`;
  // 검색 추가시
  const content = document.querySelector(".locationInput");
  const match_content = document.querySelector(".matchLocation");

  // 댓글 업데이트 부분
  //새 HTTPRequest 생성
  const requestFindLocation = new XMLHttpRequest();

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
    requestFindLocation.send(
      JSON.stringify({
        input_text: content.value,
      })
    );
  }

  // 댓글 업데이트 요청 응답 온 후
  requestFindLocation.onreadystatechange = () => {
    if (requestFindLocation.readyState === XMLHttpRequest.DONE) {
      if (requestFindLocation.status < 400) {
        const { location_names } = JSON.parse(requestFindLocation.response);
        if (location_names.length == 0) {
          match_content.innerText = "";
          // 일치하는 이름이 없으므로 제출 불가
          scoreSubmitBtn.disabled = true;
          scoreSubmitBtn.innerText = "올바른 골프장 이름을 입력 바랍니다.";
        } else if (
          location_names.length == 1 &&
          location_names[0][0] == content.value
        ) {
          match_content.innerHTML = "";
          // 정확히 일치하는 이름 있으므로 선택 가능
          scoreSubmitBtn.disabled = false;
          scoreSubmitBtn.innerText = "점수등록";
        } else {
          match_content.innerHTML = "";
          location_names.forEach((element) => {
            match_content.innerHTML += `<li class="nameOption">${element[0]}</li>`;
          });
          // 클릭시 해당 정보 가져오기
          listItems = document.querySelectorAll(".nameOption");
          listItems.forEach((list_item) => {
            list_item.addEventListener("click", function (e) {
              content.value = list_item.innerText;
              match_content.innerHTML = "";
            });
          });
          scoreSubmitBtn.disabled = true;
          scoreSubmitBtn.innerText = "올바른 골프장 이름을 입력 바랍니다.";
        }
      }
    }
  };

  content.addEventListener("keyup", findLocation);
  content.addEventListener("input", findLocation);

  // content.addEventListener("blur", () => {
  // content.value = document.querySelector(".nameOption").innerText;
  // match_content.innerHTML = "";
  // });
}
