/********************************************/
/*                 유저리뷰                  */
/********************************************/

/******************************/
/*        페이지네이션        */
/*****************************/
// 한 페이지에 보여줄 리뷰 수
const a_page_review_count = 5;

// 함수명 : reviewPagination
// 전달인자 : totalReviewCount
// 기능 : 페이지네이션, 현재 페이지 표시
function reviewPagination(totalReviewCount) {
  // 페이지 공간
  const pageList = document.querySelector(".page-list");
  pageList.innerHTML = "";
  totalPageCount = Math.ceil(totalReviewCount / a_page_review_count);
  console.log(totalPageCount)

  for (let i = 1; i <= totalPageCount; i++) {
    if (now_page == i) {
      pageList.innerHTML += `<li><span class="pageNum page-${i} nowPage" onclick="findReviews(${i})">${i}</span></li>`;
    } else {
      pageList.innerHTML += `<li><span class="pageNum page-${i}" onclick="findReviews(${i})">${i}</span></li>`;
    }
  }

  const leftBtn = document.querySelectorAll(".left-move-btn");
  const rightBtn = document.querySelectorAll(".right-move-btn");

  // 첫 페이지 마지막 페이지 관리
  if (now_page == 1) {
    console.log("첫페이지");
    leftBtn[0].classList.add("nonDisplay");
    leftBtn[1].classList.add("nonDisplay");
    rightBtn[0].classList.remove("nonDisplay");
    rightBtn[1].classList.remove("nonDisplay");
    if (totalPageCount == 1){
      rightBtn[0].classList.add("nonDisplay");
      rightBtn[1].classList.add("nonDisplay");
    }
  } else if (now_page == totalPageCount) {
    console.log("마지막페이지");
    rightBtn[0].classList.add("nonDisplay");
    rightBtn[1].classList.add("nonDisplay");
    leftBtn[0].classList.remove("nonDisplay");
    leftBtn[1].classList.remove("nonDisplay");
  } else {
    console.log("중간페이지");
    leftBtn[0].classList.remove("nonDisplay");
    rightBtn[0].classList.remove("nonDisplay");
    leftBtn[1].classList.remove("nonDisplay");
    rightBtn[1].classList.remove("nonDisplay");
  }
}

// 리뷰 불러오기 부분
//새 HTTPRequest 생성
const requestFindReviews = new XMLHttpRequest();

// 함수명 : findReviews
// 전달인자 : --
// 기능 : 서버에 해당 이름의 장소 있는지 체크
function findReviews(page_num) {
  // 정렬 기준
  const sortType = document.getElementById("sortType");
  //  몇 페이지 인지 체크
  const reviewSection = document.querySelector(".reviewSection");
  const url = `/locations/review_list/`;
  requestFindReviews.open("POST", url, true);
  requestFindReviews.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  reviewSection.innerHTML = "불러오는 중...";
  requestFindReviews.send(
    JSON.stringify({
      ground_id: ground_id,
      sortType: sortType.value,
      page_num: page_num,
    })
  );
}

// 리뷰 내용 응답 온 후
requestFindReviews.onreadystatechange = () => {
  if (requestFindReviews.readyState === XMLHttpRequest.DONE) {
    if (requestFindReviews.status < 400) {
      const { review_names, reviews_counts, page_num, now_user, profile_list } =
        JSON.parse(requestFindReviews.response);
      const reviewSection = document.querySelector(".reviewSection");
      reviewSection.innerHTML = "";
      // 리뷰 추가
      if (review_names.length == 0) {
        reviewSection.innerHTML = "리뷰가 존재하지 않습니다!";
      } else {
        // [0] : review.id
        // [1] : reviewer.id
        // [2] : reviewer.nickname
        // [3] : reviewer.image
        // [4] : content
        // [5] : rating
        // [6] : rate_tag")
        let i = 0;

        review_names.forEach((review) => {
          if (now_user == review[1]) {
            reviewSection.innerHTML += `
            <div class="a_review Rid-${review[0]}">
            <div class="a_review_reviewer">
              <img
                class="a_review_reviewer_profile"
                src="${profile_list[i]}"
              />
              <div class="a_review_reviewer_nickname">${review[2]}</div>
            </div>
            <div class="a_review_content">${review[3]}</div>
            <div class="a_review_rating">
              <span>${review[4]}</span>
              <div class="starRate ${review[5]} smallStar">
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
              </div>
            </div>
        
            <div class="review-btns">
              <button
                class="a_review_delete"
                onclick="deleteReview(${review[0]},${ground_id})"
              >
                삭제
              </button>
              <button
                class="a_review_delete"
                onclick="updateReviewBtn(${review[0]}, ${ground_id})"
              >
                수정
              </button>
            </div>
          </div>`;
          } else {
            reviewSection.innerHTML += `
            <div class="a_review Rid-${review[0]}">
            <div class="a_review_reviewer">
              <img
                class="a_review_reviewer_profile"
                src="${profile_list[i]}"
              />
              <div class="a_review_reviewer_nickname">${review[2]}</div>
            </div>
            <div class="a_review_content">${review[3]}</div>
            <div class="a_review_rating">
              <span>${review[4]}</span>
              <div class="starRate ${review[5]} smallStar">
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
                <div class="star"></div>
              </div>
            </div>
            <div class="review-btns">
            </div>
          </div>
            `;
          }
          i += 1;
        });
      }

      // 현재 페이지 저장
      now_page = page_num;

      // 페이지 수정
      reviewPagination(reviews_counts);
    }
  }
};



/********************************************/
/*          리뷰 종류 바꾸기 관련 함수        */
/********************************************/

/*******************************/
/*        주요 변수 선언        */
/*******************************/

// 유저 리뷰 버튼
const userReviewBtn = document.querySelector(".userReview");
// 네이버 리뷰 버튼
const naverReviewBtn = document.querySelector(".naverReview");

// 유저 리뷰 공간
const userReviews = document.querySelector("#Review");
// 네이버 블로그 리뷰 공간
const naverReviews = document.querySelector(".naver-review");

// 함수명 : showUserReview
// 전달인자 : --
// 기능 : 유저 리뷰 보여주고, 네이버 리뷰 내리기
function showUserReview() {
  userReviewBtn.disabled = true;
  userReviewBtn.classList.add('active')
  naverReviewBtn.disabled = false;
  naverReviewBtn.classList.remove('active')
  
  userReviews.style.display = 'flex';
  naverReviews.style.display = 'none';
}

// 함수명 : showNaverReview
// 전달인자 : --
// 기능 : 네이버 블로그 리뷰 보여주고, 유저 리뷰 내리기
function showNaverReview() {
  userReviewBtn.disabled = false;
  userReviewBtn.classList.remove('active')
  naverReviewBtn.disabled = true;
  naverReviewBtn.classList.add('active')

  userReviews.style.display = 'none';
  naverReviews.style.display = 'flex';
}


// 시작시
document.addEventListener("DOMContentLoaded", ()=>{findReviews(1); showUserReview();});