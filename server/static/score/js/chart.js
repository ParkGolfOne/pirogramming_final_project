// views.py 에서 점수 데이터 받아오기
//새 HTTPRequest 생성
const requestUserScore = new XMLHttpRequest();

// 함수명 : getScoreInfo
// 전달인자 : none
// 기능 : 서버에 유저의 total_score 전달 받음.
function getScoreInfo() {
  const content = document.querySelector(".userId");
  user_id = content.innerHTML;

  const url = `/score/take_score_info/`;
  requestUserScore.open("POST", url, true);
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


let all_scores;

// 스코어 정보 요청 응답 온 후
requestUserScore.onreadystatechange = () => {
  if (requestUserScore.readyState === XMLHttpRequest.DONE) {
    if (requestUserScore.status < 400) {
      const { scores } = JSON.parse(requestUserScore.response);
     
      let labels = [];
      for (let i = 1; i <= scores.length; i++){
        labels.push(i)
      }
      console.log(labels)
      const data = scores;

      // 차트 데이터 설정
      const chartData = {
        labels: labels,
        datasets: [
          {
            label: "전체 점수 추이",
            data: data,
            borderColor: "rgb(75, 192, 192)",
            backgroundColor: "rgb(75, 192, 192, 0.2)",
          },
        ],
      };

    // 차트 옵션 설정
    const chartOptions = {
      responsive: true,
      plugins: {
        legend: {
          position: "top",
        },
        title: {
          display: true,
          text: "점수 추이",
        },
      },
      scales: {
        x: {
          beginAtZero: true,
        },
        y: {
          beginAtZero: true,
          min : 0,
          max : 90,
        },
      },
    };

    // 차트 생성
    const ctx = document.getElementById('myChart').getContext('2d');
    const myChart = new Chart(ctx, {
      type: 'line',
      data: chartData,
      options: chartOptions,
    });
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




