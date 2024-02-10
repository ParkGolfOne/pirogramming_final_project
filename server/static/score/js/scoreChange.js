// 전체 PAR 합
const totalPar = document.querySelector(".totalParBox");
if (totalPar.innerText == 0) {
  const parList = document.querySelectorAll(".parInput");
  let sumPar = 0;
  parList.forEach((p) => {
    sumPar += Number(p.value);
  });
  totalPar.innerText = sumPar;
}
// 전체 점수 합
const totalScore = document.querySelector(".totalScoreBox");

// Par 감소
function decPar(index) {
  const par = document.querySelector(`.par${index}`);

  if (par.value > 3) {
    par.value = Number(par.value) - 1;
    totalPar.innerText = Number(totalPar.innerText) - 1;
  }
}
// Par 증가
function incPar(index) {
  const par = document.querySelector(`.par${index}`);
  if (par.value < 5) {
    par.value = Number(par.value) + 1;
    totalPar.innerText = Number(totalPar.innerText) + 1;
  }
}

// Score 감소
function decScore(index) {
  const score = document.querySelector(`.score${index}`);
  if (score.value > 0) {
    score.value = Number(score.value) - 1;
    totalScore.innerText = Number(totalScore.innerText) - 1;
  }
}
// Score 증가
function incScore(index) {
  const score = document.querySelector(`.score${index}`);
  if (score.value < 10) {
    score.value = Number(score.value) + 1;
    totalScore.innerText = Number(totalScore.innerText) + 1;
  }
}
