// views.py 에서 점수 데이터 받아오기
//새 HTTPRequest 생성
const requestUserScore = new XMLHttpRequest();
const requestFilterScore = new XMLHttpRequest();
const locationName = document.querySelector(".locationInfo");
const userId = document.querySelector(".userId");
const scoreList = document.querySelector(".scoreList");
// 정렬 옵션 부분 가져오기
const sortType = document.querySelector(".sortSelect");

var myChart = null;

// 함수명 : getScoreInfo
// 전달인자 : none
// 기능 : 서버에 유저의 total_score 전달 받음.
function getScoreInfo(flag) {
  // 기존 차트 지우기
  if (myChart !== null) {
    myChart.destroy();
  }

  //유저 아이디 가져오기 (접속자 기준 x)
  user_id = userId.innerHTML;

  //선택한 골프장 가져오기
  let location_name = locationName.value;
  //전체 필터면 flag false->objects.all()
  if (location_name == "all") {
    flag = 0;
  }
  const url = `/score/take_score_info/`;
  requestUserScore.open("POST", url, true);
  requestUserScore.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  requestUserScore.send(
    JSON.stringify({
      user_id: user_id,
      flag: flag,
      location_name: location_name,
      sort: "-id",
    })
  );
}

let all_scores;

// 스코어 정보 요청 응답 온 후
requestUserScore.onreadystatechange = () => {
  if (requestUserScore.readyState === XMLHttpRequest.DONE) {
    if (requestUserScore.status < 400) {
      const { scores, score_info } = JSON.parse(requestUserScore.response);
      // 스코어
      scoreList.innerHTML = "";
      score_info.forEach((element) => {
        scoreList.innerHTML += `<div class="scoreBox">
        <a href="/score/score_detail/${element.score_id}/">
          <div>${element.ground_name}</div>
          <div class="totalScore">기록 : ${element.total_score}</div>
        </a>
      </div>`;
      });

      //차트 시작 설정
      scores.unshift(90);

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
            reverse: true,
            min: 0,
            max: 90,
          },
        },
      };

      // 차트 생성
      const ctx = document.getElementById("myChart").getContext("2d");
      myChart = new Chart(ctx, {
        type: "line",
        data: chartData,
        options: chartOptions,
      });
    }
  }
};

getScoreInfo(0);

// 함수명 : changeSort
// 전달인자 : 없음
// 기능 : 점수 리스트를 바꾸어준다.
function changeSort() {
  //유저 아이디 가져오기 (접속자 기준 x)
  user_id = userId.innerHTML;

  //선택한 골프장 가져오기
  let location_name = locationName.value;
  //전체 필터면 flag false->objects.all()
  flag = 1;
  if (location_name == "all") {
    flag = 0;
  }
  const url = `/score/take_score_info/`;
  requestFilterScore.open("POST", url, true);
  requestFilterScore.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );

  requestFilterScore.send(
    JSON.stringify({
      user_id: user_id,
      flag: flag,
      location_name: location_name,
      sort: sortType.value,
    })
  );
}

// 스코어 정보 요청 응답 온 후
requestFilterScore.onreadystatechange = () => {
  if (requestFilterScore.readyState === XMLHttpRequest.DONE) {
    if (requestFilterScore.status < 400) {
      const { scores, score_info } = JSON.parse(requestFilterScore.response);
      // 스코어
      scoreList.innerHTML = "";
      score_info.forEach((element) => {
        scoreList.innerHTML += `<div class="scoreBox">
        <a href="/score/score_detail/${element.score_id}/">
          <div>${element.ground_name}</div>
          <div class="totalScore">기록 : ${element.total_score}</div>
        </a>
      </div>`;
      });
    }
  }
};
