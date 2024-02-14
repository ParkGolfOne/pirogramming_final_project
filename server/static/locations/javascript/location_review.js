// 리뷰 입력창
const reviewInput = document.querySelector(".input-area");

//리뷰 수정 플래그
var updateFlag = false;

// 별 모양 바뀌는 함수
function StarChangeStart() {
  /********************************************/
  /*           별 관련 ajax (리뷰 추가)        */
  /********************************************/

  // 리뷰 추가의 별표 추가 버튼
  const addRate = document.querySelector(".addRate");
  // 저장된 값
  var original_rate = addRate.classList.value;

  addRate.addEventListener("mousemove", (event) => {
    // 태그의 위치
    const five_star = addRate.getBoundingClientRect();

    // 마우스의 현재 위치
    const mouseX = event.clientX;

    // 구분 단위
    const unit = five_star.width / 10;

    // 마우스와 태그의 시작점 간의 거리
    const distance = Math.abs(mouseX - five_star.left);

    // 태그의 위치 칸 계산
    const where = distance / unit;

    if (0 < where && where <= 1) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "half");
    } else if (1 < where && where <= 2) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "one");
    } else if (2 < where && where <= 3) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "one_half");
    } else if (3 < where && where <= 4) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "two");
    } else if (4 < where && where <= 5) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "two_half");
    } else if (5 < where && where <= 6) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "three");
    } else if (6 < where && where <= 7) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "three_half");
    } else if (7 < where && where <= 8) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "four");
    } else if (8 < where && where <= 9) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "four_half");
    } else if (9 < where && where <= 10) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "five");
    }
  });

  addRate.addEventListener("mouseleave", () => {
    addRate.classList = original_rate;
  });

  addRate.addEventListener("click", (event) => {
    // 태그의 위치
    const five_star = addRate.getBoundingClientRect();

    // 마우스의 현재 위치
    const mouseX = event.clientX;

    // 구분 단위
    const unit = five_star.width / 10;

    // 마우스와 태그의 시작점 간의 거리
    const distance = Math.abs(mouseX - five_star.left);

    // 태그의 위치 칸 계산
    const where = distance / unit;

    if (0 < where && where <= 1) {
      original_rate = "starRate addRate half";
      inputRate = 0.5;
    } else if (1 < where && where <= 2) {
      original_rate = "starRate addRate one";
      inputRate = 1.0;
    } else if (2 < where && where <= 3) {
      original_rate = "starRate addRate one_half";
      inputRate = 1.5;
    } else if (3 < where && where <= 4) {
      original_rate = "starRate addRate two";
      inputRate = 2.0;
    } else if (4 < where && where <= 5) {
      original_rate = "starRate addRate two_half";
      inputRate = 2.5;
    } else if (5 < where && where <= 6) {
      original_rate = "starRate addRate three";
      inputRate = 3.0;
    } else if (6 < where && where <= 7) {
      original_rate = "starRate addRate three_half";
      inputRate = 3.5;
    } else if (7 < where && where <= 8) {
      original_rate = "starRate addRate four";
      inputRate = 4.0;
    } else if (8 < where && where <= 9) {
      original_rate = "starRate addRate four_half";
      inputRate = 4.5;
    } else if (9 < where && where <= 10) {
      original_rate = "starRate addRate five";
      inputRate = 5.0;
    }
  });
}
StarChangeStart();
// 리뷰 제거 부분

const requestReviewDelete = new XMLHttpRequest();

// 함수명 : deleteReview
// 전달인자 : review_id
// 기능 : 서버에 리뷰 삭제 요청 하기 위해 review_id 전달
function deleteReview(review_id, ground_id) {
  const url = `/locations/review_delete/`;
  requestReviewDelete.open("POST", url, true);
  requestReviewDelete.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestReviewDelete.send(
    JSON.stringify({ review_id: review_id, ground_id: ground_id })
  );
}

// 리뷰 삭제 요청 응답 온 후
requestReviewDelete.onreadystatechange = () => {
  if (requestReviewDelete.readyState === XMLHttpRequest.DONE) {
    if (requestReviewDelete.status < 400) {
      const { review_id, totalRate, rateNum } = JSON.parse(
        requestReviewDelete.response
      );
      const element = document.querySelector(`.Rid-${review_id}`);
      element.remove();
      const rateDisplay = document.querySelector(".rateNum");
      rateDisplay.innerText = `평가수 ${rateNum} 평점 ${totalRate}`;
    }
  }
};

// 리뷰 추가 부분

//새 HTTPRequest 생성
const requestReviewAdd = new XMLHttpRequest();

// 함수명 : writeReview
// 전달인자 : ground_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function writeReview(ground_id) {
  if (inputRate == 0.0) {
    alert("평점은 최소 0.5 점 부터 입니다!");
    return;
  }

  const content = document.querySelector(".review-input-box");
  const url = `/locations/review_create/`;
  requestReviewAdd.open("POST", url, true);
  requestReviewAdd.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestReviewAdd.send(
    JSON.stringify({
      ground_id: ground_id,
      content: content.value,
      rating: inputRate,
    })
  );
  content.value = "";
}

// 리뷰 추가 요청 응답 온 후
requestReviewAdd.onreadystatechange = () => {
  if (requestReviewAdd.readyState === XMLHttpRequest.DONE) {
    if (requestReviewAdd.status < 400) {
      const {
        reviewer,
        content,
        reviewId,
        rating,
        totalRate,
        rateNum,
        groundId,
        profile_url,
      } = JSON.parse(requestReviewAdd.response);
      // 별모양
      let starShape = "";
      if (rating == 0.5) {
        starShape = "half";
      } else if (rating == 1.0) {
        starShape = "one";
      } else if (rating == 1.5) {
        starShape = "one_half";
      } else if (rating == 2.0) {
        starShape = "two";
      } else if (rating == 2.5) {
        starShape = "two_half";
      } else if (rating == 3.0) {
        starShape = "three";
      } else if (rating == 3.5) {
        starShape = "three_half";
      } else if (rating == 4.0) {
        starShape = "four";
      } else if (rating == 4.5) {
        starShape = "four_half";
      } else if (rating == 5.0) {
        starShape = "five";
      }
      const element = document.querySelector(".reviewSection");
      let originHTML = element.innerHTML;
      element.innerHTML += `<div class="a_review Rid-${reviewId}">
            <div class="a_review_reviewer">
              <img
              class="a_review_reviewer_profile"
              src="${profile_url}"
              />
              <div>${reviewer}</div>
            </div>
            <div class="a_review_content">${content}</div>
            <div class="a_review_rating"><span>${rating}</span>
              <div class="starRate  ${starShape} smallStar">
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
              </div>
            </div>
            <button
              class="a_review_delete"
              onclick="deleteReview(${reviewId}, ${groundId})"
            >
              삭제
            </button>
            <button
              class="a_review_delete"
              onclick="updateReviewBtn(${reviewId}, ${groundId})"
            >
              수정
            </button>`;

      const rateDisplay = document.querySelector(".rateNum");
      rateDisplay.innerText = `평가수 ${rateNum} 평점 ${totalRate}`;
      // 입력 평점 초기화
      inputRate = 0.0;
      // 별 초기화
      document.querySelector(".addRate").classList = "starRate addRate";
      original_rate = "starRate addRate";
    }
  }
};

// 리뷰 업데이트 부분
//새 HTTPRequest 생성
const requestReviewUpdate = new XMLHttpRequest();

// 함수명 : updateReview
// 전달인자 : review_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function updateReview(review_id, ground_id) {
  const content = document.querySelector(".review-update-box");
  const url = `/locations/review_update/`;
  requestReviewUpdate.open("POST", url, true);
  requestReviewUpdate.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestReviewUpdate.send(
    JSON.stringify({
      ground_id: ground_id,
      review_id: review_id,
      content: content.value,
      rating: inputRate,
    })
  );
  content.value = "";
}

// 리뷰 업데이트 요청 응답 온 후
requestReviewUpdate.onreadystatechange = () => {
  if (requestReviewUpdate.readyState === XMLHttpRequest.DONE) {
    if (requestReviewUpdate.status < 400) {
      const {
        reviewer,
        content,
        reviewId,
        rating,
        totalRate,
        rateNum,
        groundId,
        profile_url,
      } = JSON.parse(requestReviewUpdate.response);
      // 별 모양
      let starShape = "";
      if (rating == 0.5) {
        starShape = "half";
      } else if (rating == 1.0) {
        starShape = "one";
      } else if (rating == 1.5) {
        starShape = "one_half";
      } else if (rating == 2.0) {
        starShape = "two";
      } else if (rating == 2.5) {
        starShape = "two_half";
      } else if (rating == 3.0) {
        starShape = "three";
      } else if (rating == 3.5) {
        starShape = "three_half";
      } else if (rating == 4.0) {
        starShape = "four";
      } else if (rating == 4.5) {
        starShape = "four_half";
      } else if (rating == 5.0) {
        starShape = "five";
      }
      const element = document.querySelector(`.Rid-${reviewId}`);
      element.innerHTML = `
            <div class="a_review_reviewer">
              <img
              class="a_review_reviewer_profile"
              src="${profile_url}"
              />
              <div>${reviewer}</div>
            </div>
            <div class="a_review_content">${content}</div>
            <div class="a_review_rating"><span>${rating}</span>
              <div class="starRate  ${starShape} smallStar">
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
              </div>
            </div>
            <button
              class="a_review_delete"
              onclick="deleteReview(${reviewId}, ${groundId})"
            >
              삭제
            </button>
            <button
              class="a_review_delete"
              onclick="updateReviewBtn(${reviewId}, ${groundId})"
            >
              수정
            </button>`;
      const rateDisplay = document.querySelector(".rateNum");
      rateDisplay.innerText = `평가수 ${rateNum} 평점 ${totalRate}`;

      // 입력 평점 초기화
      inputRate = 0.0;
      updateFlag = false;
      // 새 리뷰 작성 추가
      reviewInput.innerHTML = `
      <h4>나의 리뷰를 작성해주세요!</h4>
      <div class="starRate addRate">
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
        <div class="star"></div>
      </div>
      <input type="text" class="review-input-box" />
      <button class="review-upload-btn" onclick="writeReview(${groundId})">
        리뷰 등록
      </button>`;
      StarChangeStart();
    }
  }
};

// 함수명 : updateReviewBtn
// 전달인자 : review_id
// 기능 : 리뷰 업데이트 버튼 입력시 input 칸으로 변경
function updateReviewBtn(review_id, ground_id) {
  //댓글 작성 칸 지우기
  reviewInput.innerHTML = "다른 댓글을 수정 중입니다!";
  // 다른 수정 버튼 block
  if (updateFlag) {
    alert("다른 댓글을 수정 중입니다!");
    return;
  }

  updateFlag = true;

  // 업데이트 창 열기
  const element = document.querySelector(`.Rid-${review_id}`);
  const content = element.querySelector(".a_review_content").innerText;
  console.log(content);
  const rate = element.querySelector(".a_review_rating").innerText;
  let starShape = "";
  inputRate = rate;
  if (rate == 0.5) {
    starShape = "half";
  } else if (rate == 1.0) {
    starShape = "one";
  } else if (rate == 1.5) {
    starShape = "one_half";
  } else if (rate == 2.0) {
    starShape = "two";
  } else if (rate == 2.5) {
    starShape = "two_half";
  } else if (rate == 3.0) {
    starShape = "three";
  } else if (rate == 3.5) {
    starShape = "three_half";
  } else if (rate == 4.0) {
    starShape = "four";
  } else if (rate == 4.5) {
    starShape = "four_half";
  } else if (rate == 5.0) {
    starShape = "five";
  }
  element.innerHTML = `
      <div class="input-area updateInput">
        <h4> 리뷰 수정 </h4>
        <div class="starRate updateRate ${starShape}">
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
          <div class="star"></div>
        </div>
        <input type="text" class="review-update-box" value="${content}" />

        <button
          class="review-upload-btn"
          onclick="updateReview(${review_id}, ${ground_id})"
        >
          수정
        </button>
      </div>`;

  /********************************************/
  /*           별 관련 ajax (리뷰 수정)        */
  /********************************************/

  // 리뷰 수정의 별표 추가 버튼
  const updateRateAll = document.querySelectorAll(".updateRate");

  updateRateAll.forEach((updateRate) => {
    // 초기값
    var update_origin_rate = updateRate.classList.value;

    updateRate.addEventListener("mousemove", (event) => {
      // 태그의 위치
      const five_star = updateRate.getBoundingClientRect();

      // 마우스의 현재 위치
      const mouseX = event.clientX;

      // 구분 단위
      const unit = five_star.width / 10;

      // 마우스와 태그의 시작점 간의 거리
      const distance = Math.abs(mouseX - five_star.left);

      // 태그의 위치 칸 계산
      const where = distance / unit;

      if (0 < where && where <= 1) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "half");
      } else if (1 < where && where <= 2) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "one");
      } else if (2 < where && where <= 3) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "one_half");
      } else if (3 < where && where <= 4) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "two");
      } else if (4 < where && where <= 5) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "two_half");
      } else if (5 < where && where <= 6) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "three");
      } else if (6 < where && where <= 7) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "three_half");
      } else if (7 < where && where <= 8) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "four");
      } else if (8 < where && where <= 9) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "four_half");
      } else if (9 < where && where <= 10) {
        updateRate.classList = "";
        updateRate.classList.add("starRate", "updateRate", "five");
      }
    });

    updateRate.addEventListener("mouseleave", () => {
      updateRate.classList = update_origin_rate;
    });

    updateRate.addEventListener("click", (event) => {
      // 태그의 위치
      const five_star = updateRate.getBoundingClientRect();

      // 마우스의 현재 위치
      const mouseX = event.clientX;

      // 구분 단위
      const unit = five_star.width / 10;

      // 마우스와 태그의 시작점 간의 거리
      const distance = Math.abs(mouseX - five_star.left);

      // 태그의 위치 칸 계산
      const where = distance / unit;

      if (0 < where && where <= 1) {
        update_origin_rate = "starRate updateRate half";
        inputRate = 0.5;
      } else if (1 < where && where <= 2) {
        update_origin_rate = "starRate updateRate one";
        inputRate = 1.0;
      } else if (2 < where && where <= 3) {
        update_origin_rate = "starRate updateRate one_half";
        inputRate = 1.5;
      } else if (3 < where && where <= 4) {
        update_origin_rate = "starRate updateRate two";
        inputRate = 2.0;
      } else if (4 < where && where <= 5) {
        update_origin_rate = "starRate updateRate two_half";
        inputRate = 2.5;
      } else if (5 < where && where <= 6) {
        update_origin_rate = "starRate updateRate three";
        inputRate = 3.0;
      } else if (6 < where && where <= 7) {
        update_origin_rate = "starRate updateRate three_half";
        inputRate = 3.5;
      } else if (7 < where && where <= 8) {
        update_origin_rate = "starRate updateRate four";
        inputRate = 4.0;
      } else if (8 < where && where <= 9) {
        update_origin_rate = "starRate updateRate four_half";
        inputRate = 4.5;
      } else if (9 < where && where <= 10) {
        update_origin_rate = "starRate updateRate five";
        inputRate = 5.0;
      }
    });
  });
  // 처음 값
}

function StarChangeStart() {
  /********************************************/
  /*           별 관련 ajax (리뷰 추가)        */
  /********************************************/

  // 리뷰 추가의 별표 추가 버튼
  const addRate = document.querySelector(".addRate");
  // 저장된 값
  var original_rate = addRate.classList.value;

  addRate.addEventListener("mousemove", (event) => {
    // 태그의 위치
    const five_star = addRate.getBoundingClientRect();

    // 마우스의 현재 위치
    const mouseX = event.clientX;

    // 구분 단위
    const unit = five_star.width / 10;

    // 마우스와 태그의 시작점 간의 거리
    const distance = Math.abs(mouseX - five_star.left);

    // 태그의 위치 칸 계산
    const where = distance / unit;

    if (0 < where && where <= 1) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "half");
    } else if (1 < where && where <= 2) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "one");
    } else if (2 < where && where <= 3) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "one_half");
    } else if (3 < where && where <= 4) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "two");
    } else if (4 < where && where <= 5) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "two_half");
    } else if (5 < where && where <= 6) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "three");
    } else if (6 < where && where <= 7) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "three_half");
    } else if (7 < where && where <= 8) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "four");
    } else if (8 < where && where <= 9) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "four_half");
    } else if (9 < where && where <= 10) {
      addRate.classList = "";
      addRate.classList.add("starRate", "addRate", "five");
    }
  });

  addRate.addEventListener("mouseleave", () => {
    addRate.classList = original_rate;
  });

  addRate.addEventListener("click", (event) => {
    // 태그의 위치
    const five_star = addRate.getBoundingClientRect();

    // 마우스의 현재 위치
    const mouseX = event.clientX;

    // 구분 단위
    const unit = five_star.width / 10;

    // 마우스와 태그의 시작점 간의 거리
    const distance = Math.abs(mouseX - five_star.left);

    // 태그의 위치 칸 계산
    const where = distance / unit;

    if (0 < where && where <= 1) {
      original_rate = "starRate addRate half";
      inputRate = 0.5;
    } else if (1 < where && where <= 2) {
      original_rate = "starRate addRate one";
      inputRate = 1.0;
    } else if (2 < where && where <= 3) {
      original_rate = "starRate addRate one_half";
      inputRate = 1.5;
    } else if (3 < where && where <= 4) {
      original_rate = "starRate addRate two";
      inputRate = 2.0;
    } else if (4 < where && where <= 5) {
      original_rate = "starRate addRate two_half";
      inputRate = 2.5;
    } else if (5 < where && where <= 6) {
      original_rate = "starRate addRate three";
      inputRate = 3.0;
    } else if (6 < where && where <= 7) {
      original_rate = "starRate addRate three_half";
      inputRate = 3.5;
    } else if (7 < where && where <= 8) {
      original_rate = "starRate addRate four";
      inputRate = 4.0;
    } else if (8 < where && where <= 9) {
      original_rate = "starRate addRate four_half";
      inputRate = 4.5;
    } else if (9 < where && where <= 10) {
      original_rate = "starRate addRate five";
      inputRate = 5.0;
    }
  });
}
