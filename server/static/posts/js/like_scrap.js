//좋아요 함수 부분
const requestLike = new XMLHttpRequest();
function pushLike(post_id) {
  const likebutton = document.querySelector(`.like-${post_id}`);
  likebutton.classList.toggle("liked");
  const url = "/communitys/post_like/";
  requestLike.open("POST", url, true);
  requestLike.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  requestLike.send(JSON.stringify({ post_id: post_id }));
}

requestLike.onreadystatechange = () => {
  if (requestLike.readyState === XMLHttpRequest.DONE) {
    if (requestLike.status < 400) {
      const { post_id, LikeNum, likeTag } = JSON.parse(requestLike.response);
      const element = document.querySelector(`.likeNum-${post_id}`);
      const originHTML = element.innerHTML;
      const [text, likenum] = originHTML.split(" ");
      let newnum = 0;

      if (likeTag == "liked") {
        newnum = Number(likenum) + 1;
      } else {
        newnum = Number(likenum) - 1;
      }

      element.innerHTML = `좋아요 ${newnum}`;
    }
  }
};

//스크랩 함수 부분
const requestScrap = new XMLHttpRequest();
function pushScrap(post_id) {
  const scrapbutton = document.querySelector(`.scrap-${post_id}`);
  scrapbutton.classList.toggle("scraped");
  const url = "/communitys/post_scrap/";
  requestScrap.open("POST", url, true);
  requestScrap.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  requestScrap.send(JSON.stringify({ post_id: post_id }));
}

requestScrap.onreadystatechange = () => {
  if (requestScrap.readyState === XMLHttpRequest.DONE) {
    if (requestScrap.status < 400) {
      const { post_id, ScrapNum, scrapTag } = JSON.parse(requestScrap.response);
      const element = document.querySelector(`.scrapNum-${post_id}`);
      const originHTML = element.innerHTML;
      const [text, scrapnum] = originHTML.split(" ");
      let newnum = 0;

      if (scrapTag == "scraped") {
        newnum = Number(scrapnum) + 1;
      } else {
        newnum = Number(scrapnum) - 1;
      }

      element.innerHTML = `스크랩 ${newnum}`;
    }
  }
};

//댓글 좋아요 함수 부분
// const requestLike = new XMLHttpRequest();
// function pushLike(post_id) {
//   const likebutton = document.querySelector(`.like-${post_id}`);
//   likebutton.classList.toggle("liked");
//   const url = "/communitys/post_like/";
//   requestLike.open("POST", url, true);
//   requestLike.setRequestHeader(
//     "Content-Type",
//     "application/x-www-form-urlencoded"
//   );

//   requestLike.send(JSON.stringify({ post_id: post_id }));
// }

// requestLike.onreadystatechange = () => {
//   if (requestLike.readyState === XMLHttpRequest.DONE) {
//     if (requestLike.status < 400) {
//       const { post_id, LikeNum, likeTag } = JSON.parse(
//         requestLike.response
//       );
//       const element = document.querySelector(`.likeNum-${post_id}`);
//       const originHTML = element.innerHTML;
//       const [text, likenum] = originHTML.split(" ");
//       let newnum = 0;

//       if (likeTag == "liked") {
//         newnum = Number(likenum) + 1;
//       } else {
//         newnum = Number(likenum) - 1;
//       }

//       element.innerHTML = `좋아요 ${newnum}`;
//     }
//   }
// };
