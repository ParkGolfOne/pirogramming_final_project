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
      scores.unshift(0);

      let labels = [];
      for (let i = 0; i < scores.length; i++) {
        labels.push(i);
      }

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
        responsive: false,
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
            min: 0,
            max: 90,
          },
        },
      };

      // 차트 생성
      const ctx = document.getElementById("myChart").getContext("2d");
      const myChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    }
  }
};

getScoreInfo();
