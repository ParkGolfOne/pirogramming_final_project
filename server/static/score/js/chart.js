// views.py 에서 점수 데이터 받아오기
//새 HTTPRequest 생성
const requestUserScore = new XMLHttpRequest();

// 함수명 : getScoreInfo
// 전달인자 : none
// 기능 : 서버에 유저의 total_score 전달 받음.
function getScoreInfo() {
  const content = document.querySelector(".userId");
  user_id = content.innerText;

  const url = `/score/take_score_info/`;
  requestUserScore.open("GET", url, true);
  requestUserScore.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestUserScore.send(
    JSON.stringify({
      user_id: user_id,
    })
  );
}

// 스코어 정보 요청 응답 온 후
requestUserScore.onreadystatechange = () => {
  if (requestUserScore.readyState === XMLHttpRequest.DONE) {
    if (requestUserScore.status < 400) {
      const { scores } = JSON.parse(requestUserScore.response);
      // scores 전달 코드
    }
  }
};

getScoreInfo();

// 차트 데이터

// 차트 데이터 GPT 작품
//   var data = {
//     labels: ["January", "February", "March", "April", "May"],
//     datasets: [
//       {
//         label: "My First Dataset",
//         data: [65, 59, 80, 81, 56],
//         fill: false,
//         borderColor: "rgb(75, 192, 192)",
//         tension: 0.1,
//       },
//     ],
//   };
// 차트 옵션
//   var options = {
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   };

// const DATA_COUNT = 7;
// const NUMBER_CFG = { count: DATA_COUNT, min: -100, max: 100 };

// const labels = Utils.months({ count: 7 });
// const data = {
//   labels: labels,
//   datasets: [
//     {
//       label: "Dataset 1",
//       data: Utils.numbers(NUMBER_CFG),
//       borderColor: Utils.CHART_COLORS.red,
//       backgroundColor: Utils.transparentize(Utils.CHART_COLORS.red, 0.5),
//     },
//   ],
// };

// const scoreChart = {
//   type: "line",
//   data: data,
//   options: {
//     responsive: true,
//     plugins: {
//       legend: {
//         position: "top",
//       },
//       title: {
//         display: true,
//         text: "점수 추이",
//       },
//     },
//     scales: {
//       y: {
//         beginAtZero: true,
//       },
//     },
//   },
// };
