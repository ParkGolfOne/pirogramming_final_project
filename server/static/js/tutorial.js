
//튜토리얼 정보 박스
const tBox = document.querySelectorAll(".tutorialBox");
// 배경
const blind = document.querySelector("#blind")


//버튼들
const bttns = document.querySelectorAll(".one")

// 클러스터
const cluster = document.querySelector("#location_map")
// // 지도
const locationBtn = bttns[0]
// // 커뮤니티
const communityBtn = bttns[1]
// // 게임
const gameBtn = bttns[3]
// // 스코어
const scoreBtn = bttns[2]

communityBtn.style.pointerEvents = "none";
locationBtn.style.pointerEvents = "none";
gameBtn.style.pointerEvents = "none";
scoreBtn.style.pointerEvents = "none";

// 튜토리얼 내용 빅스 모음
// 1. 시작
const tuto_start = document.querySelector(".tuto-start")
// 2. 클러스터
const tuto_cluster = document.querySelector(".tuto-cluster")
// 3. 지도
const tuto_location = document.querySelector(".tuto-location")
// 4. 커뮤니티
const tuto_board = document.querySelector(".tuto-board")
// 5. 게임
const tuto_game = document.querySelector(".tuto-game")
// 6. 스코어
const tuto_score = document.querySelector(".tuto-score")
// 7. 종료
const tuto_end = document.querySelector(".tuto-end")




// 메인 페이지 튜토리얼
function tutorialStart(){
    blind.style.display = "block";
    tutorialProcess(1);
}

// 모든 튜토리얼 박스 내용 제거
function removeTutoValue(){
    tBox.forEach((tuto)=>{
        tuto.style.display = "none";
        tuto.innerHTML = "";
    })
}


// 튜툐리얼 진행중
// 함수명 : tutorialProcess
// 전달인자 : step
// 기능 : 각 단계에 맞추어 표시
function tutorialProcess(step){
    switch (step){
        case 1 :
            removeTutoValue()
            tuto_start.style.display = "flex";
            tuto_start.innerHTML = `
            <h2> 안녕하세요 지금부터 메인화면 튜토리얼을 시작하겠습니다.</h2>
            <div class="tutoBtns">
                <div>1/7</div>
                <button class="nextTuto" onclick="tutorialProcess(2)"></button>
            </div>
            `;

            break;
        case 2 :
            removeTutoValue()
            // 해당 블럭 하이라이트
            cluster.style.zIndex = 15;
            // 양 옆 하이라이트 해제
            locationBtn.style.zIndext = 0;
            // 설명 하이라이트
            tuto_cluster.style.display = "flex"
            tuto_cluster.innerHTML = `
            <h2> 클러스터 기능 설명 </h2>
            <div class="tutoBtns">
                <button class="prevTuto" onclick="tutorialProcess(1)"></button>
                <div>2/7</div>
                <button class="nextTuto" onclick="tutorialProcess(3)"></button>
            </div>
            `;
            break;
        case 3 :
            removeTutoValue()
            // 해당 블럭 하이라이트
            locationBtn.style.zIndex = 15;
            // 양 옆 하이라이트 해제
            cluster.style.zIndex = 0;
            communityBtn.style.zIndex = 0;
            // 설명 하이라이트
            tuto_location.style.display = "flex"
            tuto_location.innerHTML = `
            <h2> 지도 기능 설명</h2>
            <div class="tutoBtns">
                <button class="prevTuto" onclick="tutorialProcess(2)"></button>
                <div>3/7</div>
                <button class="nextTuto" onclick="tutorialProcess(4)"></button>
            </div>
            `;
            break;
        case 4 :
            removeTutoValue()
            // 해당 블럭 하이라이트
            communityBtn.style.zIndex = 15;
            // 양 옆 하이라이트 해제
            locationBtn.style.zIndex = 0;
            gameBtn.style.zIndex = 0;
            // 설명 하이라이트
            tuto_board.style.display = "flex"
            tuto_board.innerHTML = `
            <h2> 커뮤니티 기능 설명</h2>
            <div class="tutoBtns">
                <button class="prevTuto" onclick="tutorialProcess(3)"></button>
                <div>4/7</div>
                <button class="nextTuto" onclick="tutorialProcess(5)"></button>
            </div>
            `;
            break;
        case 5 :
            removeTutoValue()
            // 해당 블럭 하이라이트
            gameBtn.style.zIndex = 15;
            // 양 옆 하이라이트 해제
            communityBtn.style.zIndex = 0;
            scoreBtn.style.zIndex = 0;
            // 설명 하이라이트
            tuto_game.style.display = "flex"
            tuto_game.innerHTML = `
            <h2> 게임 기능 설명</h2>
            <div class="tutoBtns">
                <button class="prevTuto" onclick="tutorialProcess(4)"></button>
                <div>5/7</div>
                <button class="nextTuto" onclick="tutorialProcess(6)"></button>
            </div>
            `;
            break;
        case 6 :
            removeTutoValue()
            // 해당 블럭 하이라이트
            scoreBtn.style.zIndex = 15;
            // 양 옆 하이라이트 해제
            gameBtn.style.zIndex = 0;
            // 설명 하이라이트
            tuto_score.style.display = "flex"
            tuto_score.innerHTML = `
            <h2> 스코어 기능 설명 </h2>
            <div class="tutoBtns">
                <button class="prevTuto" onclick="tutorialProcess(5)"></button>
                <div>6/7</div>
                <button class="nextTuto" onclick="tutorialProcess(7)"></button>
            </div>
            `;
            break;
        case 7 :
            removeTutoValue()
            // 양 옆 하이라이트 해제
            scoreBtn.style.zIndex = 0;
            // 설명 하이라이트
            tuto_end.style.display = "flex"
            tuto_end.innerHTML = `
            <h2> 튜토리얼이 모두 종료되었습니다. 모두 좋은 시간 보내세요!</h2>
            <div class="tutoBtns">
                <button class="prevTuto" onclick="tutorialProcess(6)"></button>
                <div>7/7</div>
            </div>
            <button class="prevTuto" onclick="tutorialEnd()">튜토리얼 끝내기</button>
            `;
            break;
    }

}


// 튜토리얼 진행 해제
function tutorialEnd(){
    blind.style.display = "none";
    removeTutoValue()
    tuto_end.style.display = "none"

    communityBtn.style.pointerEvents = "auto";
    locationBtn.style.pointerEvents = "auto";
    gameBtn.style.pointerEvents = "auto";
    scoreBtn.style.pointerEvents = "auto";
}
