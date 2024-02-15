//좋아요 함수 부분
const requestLike = new XMLHttpRequest();
function pushLike(post_id) {
  // 좋아요 벙튼
  const likebutton = document.querySelector(`.like-${post_id}`);
  // 좋아요 숫자 칸
  const element = document.querySelector(`.likeNum-${post_id}`);
  likebutton.classList.toggle("liked");
  if (likebutton.classList.contains("liked")){
    element.innerHTML = Number(element.innerHTML) + 1
  }
  else{
    element.innerHTML = Number(element.innerHTML) - 1
  }
  likebutton.disabled = true;
  const url = "/communitys/post_like/";
  requestLike.open("POST", url, true);
  requestLike.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  requestLike.send(JSON.stringify({ post_id: post_id }));

  requestLike.onreadystatechange = () => {
    if (requestLike.readyState === XMLHttpRequest.DONE) {
      if (requestLike.status < 400) {
        const { likeNum } = JSON.parse(requestLike.response);
        element.innerHTML = `${likeNum}`;

        likebutton.disabled = false;
      }
    }
  };
}



//스크랩 함수 부분
const requestScrap = new XMLHttpRequest();
function pushScrap(post_id) {
  // 스크랩 버튼
  const scrapbutton = document.querySelector(`.scrap-${post_id}`);
  // 스크랩 숫자 표시부분
  const element = document.querySelector(`.scrapNum-${post_id}`);
  scrapbutton.classList.toggle("scraped");
  if (scrapbutton.classList.contains("scraped")){
    element.innerHTML = Number(element.innerHTML) + 1
  }
  else{
    element.innerHTML = Number(element.innerHTML) - 1
  }

  scrapbutton.disabled = true;
  const url = "/communitys/post_scrap/";
  requestScrap.open("POST", url, true);
  requestScrap.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  requestScrap.send(JSON.stringify({ post_id: post_id }));

  requestScrap.onreadystatechange = () => {
    if (requestScrap.readyState === XMLHttpRequest.DONE) {
      if (requestScrap.status < 400) {
        const { scrapNum } = JSON.parse(requestScrap.response);
        
        element.innerHTML = scrapNum;
        scrapbutton.disabled = false;
      }
    }
  };
}


