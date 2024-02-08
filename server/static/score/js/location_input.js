const locationInput = document.querySelector(".locationInputArea");
const scoreSubmitBtn = document.querySelector(".scoreSubmitBtn");
//초기 세팅
scoreSubmitBtn.disabled = true;
scoreSubmitBtn.value = "골프장 입력 오류";

function changeLocationInput() {
  //초기 세팅
  scoreSubmitBtn.disabled = true;
  scoreSubmitBtn.value = "골프장 입력 오류";
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
        sortType: "golf_name",
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
          scoreSubmitBtn.value = "골프장 입력 오류";
        } else if (
          location_names.length == 1 &&
          location_names[0][0] == content.value
        ) {
          match_content.innerHTML = "";
          // 정확히 일치하는 이름 있으므로 선택 가능
          scoreSubmitBtn.disabled = false;
          scoreSubmitBtn.value = "점수등록";
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
              // 정확히 일치하는 이름 있으므로 선택 가능
              scoreSubmitBtn.disabled = false;
              scoreSubmitBtn.value = "점수등록";
              allScoreCheck();
            });
          });
          scoreSubmitBtn.disabled = true;
          scoreSubmitBtn.value = "골프장 입력 오류";
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

function checkSubmitPossible() {
  const locationSelect = document.querySelector(".locationSelect");
  if (locationSelect.value != null) {
    allScoreCheck();
  }
}

function allScoreCheck() {
  const parSelect = document.querySelectorAll(".parInput");
  const scoreSelect = document.querySelectorAll(".scoreInput");
  for (let i = 0; i < 9; i++) {
    const p = parSelect[i];
    if (p.value < 3 || p.value > 5) {
      scoreSubmitBtn.value = "PAR 오입력";
      scoreSubmitBtn.disabled = true;

      return; // 함수 전체 종료
    }
  }

  for (let i = 0; i < 9; i++) {
    const s = scoreSelect[i];
    if (s.value == "" || s.value < 0 || s.value > 10) {
      scoreSubmitBtn.value = "점수 범위 오류";
      scoreSubmitBtn.disabled = true;
      return; // 함수 전체 종료
    }
  }
  scoreSubmitBtn.disabled = false;
  scoreSubmitBtn.value = "점수등록";
}
