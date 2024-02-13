const reViewContainer = document.querySelector(".review-container");
const golfName = document.querySelector(".golf-name");
const locationName = golfName.innerHTML;

document.addEventListener("DOMContentLoaded", function () {
  // 선택된 골프장 이름을 쿼리에 넣어 네이버 블로그 검색
  var xhr = new XMLHttpRequest();
  xhr.open(
    "GET","/locations/naver_blog/?input=" + encodeURIComponent(locationName),
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      const naverReview = JSON.parse(xhr.responseText);
      updateNaverReviewField(naverReview.output);
    }
  };
  xhr.send();
});

// 받아온 town 데이터를 option 태그로 만들어서 추가함
function updateNaverReviewField(naverReview) {
  reViewContainer.innerHTML = "";

  naverReview.forEach(function (review) {
    const div = document.createElement("div");
    div.classList.add("review-item");
    const title = document.createElement("div");
    title.innerHTML = `<a href="${review.link}" target="_blank">${review.title}</a>`;
    title.classList.add("review-title");
    const content = document.createElement("div");
    content.innerHTML = `${review.description}`;
    content.classList.add("review-content");
    const writer = document.createElement("div");
    writer.innerHTML = `${review.bloggername}`;
    writer.classList.add("review-writer");

    div.appendChild(title);
    div.appendChild(content);
    div.appendChild(writer);

    reViewContainer.appendChild(div);
  });
}
