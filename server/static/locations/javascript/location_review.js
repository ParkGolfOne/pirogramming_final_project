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
  requestReviewDelete.send(JSON.stringify({ review_id: review_id, ground_id : ground_id }));
}

// 리뷰 삭제 요청 응답 온 후
requestReviewDelete.onreadystatechange = () => {
  if (requestReviewDelete.readyState === XMLHttpRequest.DONE) {
    if (requestReviewDelete.status < 400) {
      const { review_id, totalRate, rateNum } = JSON.parse(requestReviewDelete.response);
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
  const content = document.querySelector(".review-input-box");
  const rating = document.querySelector(".rateSelect")
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
      rating: rating.value,
    })
  );
  content.value = "";
}

// 리뷰 추가 요청 응답 온 후
requestReviewAdd.onreadystatechange = () => {
  if (requestReviewAdd.readyState === XMLHttpRequest.DONE) {
    if (requestReviewAdd.status < 400) {
      const { reviewer, content, reviewId, rating, totalRate, rateNum, groundId } = JSON.parse(
        requestReviewAdd.response
      );
      const element = document.querySelector(".reviewSection");
      let originHTML = element.innerHTML;
      element.innerHTML += `<div class="a_review Rid-${reviewId}">
            <div class="a_review_reviewer">${reviewer}</div>
            <div class="a_review_content">${content}</div>
            <div class="a_review_rating">${rating}</div>
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
  const rating = document.querySelector(".rateSelect")
  const url = `/locations/review_update/`;
  requestReviewUpdate.open("POST", url, true);
  requestReviewUpdate.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestReviewUpdate.send(
    JSON.stringify({
      ground_id : ground_id,
      review_id: review_id,
      content: content.value,
      rating : rating.value,
    })
  );
  content.value = "";
}

// 댓글 업데이트 요청 응답 온 후
requestReviewUpdate.onreadystatechange = () => {
  if (requestReviewUpdate.readyState === XMLHttpRequest.DONE) {
    if (requestReviewUpdate.status < 400) {
      const { reviewer, content, reviewId, rating, totalRate,rateNum } = JSON.parse(
        requestReviewUpdate.response
      );
      const element = document.querySelector(`.Rid-${reviewId}`);
      element.innerHTML = `<div class="a_review_reviewer">${reviewer}</div>
            <div class="a_review_content">${content}</div>
            <div class="a_review_rating">${rating}</div>
            <button
              class="a_review_delete"
              onclick="deleteReview(${reviewId})"
            >
              삭제
            </button>
            <button
              class="a_review_delete"
              onclick="updateReviewBtn(${reviewId})"
            >
              수정
            </button>`;
    const rateDisplay = document.querySelector(".rateNum");
    rateDisplay.innerText = `평가수 ${rateNum} 평점 ${totalRate}`;
    }
  }
};

// 함수명 : updateReviewBtn
// 전달인자 : review_id
// 기능 : 리뷰 업데이트 버튼 입력시 input 칸으로 변경
function updateReviewBtn(review_id, ground_id) {
  const element = document.querySelector(`.Rid-${review_id}`);
  const content = element.querySelector('.a_review_content').innerText
  const rate = element.querySelector('.a_review_rating').innerText
  element.innerHTML = `<div class="input-area">
        <input type="text" class="review-update-box" value=${content} />
        <select
        class="rateSelect"
        type="select"
        name="review"
        onchange=""
      >
        <option value="5.0">5.0</option>
        <option value="4.5">4.5</option>
        <option value="4.0">4.0</option>
        <option value="3.5">3.5</option>
        <option value="3.0">3.0</option>
        <option value="2.5">2.5</option>
        <option value="2.0">2.0</option>
        <option value="1.5">1.5</option>
        <option value="1.0">1.0</option>
        <option value="0.5">0.5</option>
        <option value="0.0">0.0</option>
      </select>
        <button
          class="review-upload-btn"
          onclick="updateReview(${review_id}, ${ground_id})"
        >
          수정
        </button>
      </div>`;
}

/* ***************별 관련 ajax************** */
const stars = document.querySelectorAll(".star")
const starline = document.querySelector(".starRate")

starline.addEventListener('mousemove', (event) => {// 태그의 위치
  const targetRect = targetElement.getBoundingClientRect();
  
  // 마우스의 현재 위치
  const mouseX = event.clientX;
  
  // 태그의 구분점
  const targetCenterX = targetRect.left + targetRect.width / 2;
  const targetCenterY = targetRect.top + targetRect.height / 2;
  
  // 마우스와 태그의 중점 간의 거리
  const distanceX = Math.abs(mouseX - targetCenterX);
  const distanceY = Math.abs(mouseY - targetCenterY);
  
  // 태그의 너비와 높이의 반값
  const halfWidth = targetRect.width / 2;
  const halfHeight = targetRect.height / 2;
  
  // 마우스가 태그의 절반 이상의 위치에 있는지 확인
  const isMouseOverHalfWidth = distanceX <= halfWidth;
  const isMouseOverHalfHeight = distanceY <= halfHeight;
  
  if (isMouseOverHalfWidth && isMouseOverHalfHeight) {
      console.log('마우스가 태그의 절반 이상의 위치에 있습니다.');
  } else {
      console.log('마우스가 태그의 절반 이하의 위치에 있습니다.');
  }})