Kakao.init("7d2565115739c70be1903fea71d797fb");

//점수 공유
function shareKakaoScore() {
  const totalScore = document.querySelector(".totalScoreArea").value;
  const scoreAreas = document.querySelectorAll(".scoreArea");
  let scores = [];
  scoreAreas.forEach((event) => {
    scores.push(event.outerText);
  });

  Kakao.Share.createDefaultButton({
    container: "#kakaotalk-sharing-btn",
    objectType: "feed",
    content: {
      title: "점수",
      description: "나의 점수 공유!",
      imageUrl: thumbnailUrl,
      link: {
        mobileWebUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
        webUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
      },
    },
    buttons: [
      {
        title: "점수 보러가기~!!",
        link: {
          mobileWebUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
          webUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
        },
      },
    ],
  });
}

// function shareKakaPost() {
//   Kakao.Share.createDefaultButton({
//     container: "#kakaotalk-sharing-btn",
//     objectType: "feed",
//     content: {
//       title: "점수",
//       description: "나의 점수 공유!",
//       imageUrl: thumbnailUrl,
//       link: {
//         mobileWebUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
//         webUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
//       },
//     },
//     buttons: [
//       {
//         title: "점수 보러가기~!!",
//         link: {
//           mobileWebUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
//           webUrl: `http://127.0.0.1:8000/score/score_detail/${sid}/`,
//         },
//       },
//     ],
//   });
// }
