
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

communityBtn.style.pointerEvents = "auto";
locationBtn.style.pointerEvents = "auto";
gameBtn.style.pointerEvents = "auto";
scoreBtn.style.pointerEvents = "auto";



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




// 메인 페이지 튜토리얼 시작
function tutorialStart(){
    blind.style.display = "block";
    tutorialProcess(1);
    communityBtn.style.pointerEvents = "none";
    locationBtn.style.pointerEvents = "none";
    gameBtn.style.pointerEvents = "none";
    scoreBtn.style.pointerEvents = "none";
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
            <h2> 전국 파크골프 위치 </h2>
            <div class="tutoContent">
                전국에 있는 파크골프장의 위치를 한눈에 보여주는 지도입니다!
                초록색 원안에는 해당 지역에 있는 파크골프장의 개수를 보여주고 있습니다.
                화면을 확대하면 화면에 보이는 지도 안에서 다시 작게 파크골프장의 개수를 보여줍니다!
                한 번 확대해보세요!
            </div>
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
            <h2> 파크골프장 기능 설명</h2>
            <div class="tutoContent">
                누르면 전국의 파크골프장 리스트를 확인할 수 있는 곳으로 이동합니다.
                이동한 페이지에서 원하시는 파크골프장을 검색, 정렬하여 찾으실 수 있습니다.
                찾으신 골프장 을 클릭하게 된다면, 해당 장소의 위치, 주소, 예약방법, 요금 등 상세정보를
                확인하실 수 있습니다.
            </div>
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
            <div class="tutoContent">
                파크골퍼들을 위한 커뮤니티를 생성하고, 마치 작은 웹사이트 카페처럼 게시글을 등록, 추천, 스크랩 할 수 있습니다!
                동호회 사람들과 새로운 소식과 정보를 공유하거나,
                새로운 파그골프 동반자를 찾기 위해 커뮤니티를 이용해보세요!
            </div>
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
            <div class="tutoContent">
                파크골프를 즐기실 때, 게임 기록을 남겨보고 싶으시지 않으신가요?
                이 버튼을 누르시면 게임을 기록하실수 있는 페이지로 넘어가게 됩니다!
                그 후 게임 이름, 코스, 참가원, 장소 총 4가지를 선택해주시면 게임 점수 입력이 시작됩니다!
                로그인하시게 된다면, 해당 게임의 기록을 개인 점수에도 저장이 가능합니다!
            </div>
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
            <div class="tutoContent">
                자신의 스코어 기록을 모두 남겨 그래프로 분석하고 싶으시다면 이 버튼을 눌러보세요!
                새로 점수를 입력하거나, 지금까지의 점수 기록을 확인하실 수 있습니다!
                추후에 골프장 점수표를 사진으로 찍어올리면 자동으로 점수가 반영되는 시스템도
                업데이트 될 예정이니 많이 기대해주세요!
            </div>
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
            <h2> 튜토리얼이 모두 종료되었습니다. </h2>
            <div class="tutoContent">추후에 한번더 튜토리얼을 보시고 싶으시다면 상단의 물음표 버튼을 눌려주세요</div>
            <div class="tutoBtns">
                <button class="prevTuto" onclick="tutorialProcess(6)"></button>
                <div>7/7</div>
                <button class="" onclick="tutorialEnd()">튜토리얼 끝내기</button>
            </div>
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
