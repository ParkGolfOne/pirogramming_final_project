const searchInput = document.querySelector("#board_search_input");
const searchBtn = document.querySelector("#board_search_btn");
const listBtn = document.querySelector("#board_list_btn");
const searchType = document.querySelector("#board_search_select");

const handleSearch = () => {
  if (searchInput.value === "") {
    alert("검색어를 입력해주세요");
    return;
  } else {
    getSearchResult(searchInput.value, searchType.value);
  }
};

const getSearchResult = (input, searchType) => {
  var xhr = new XMLHttpRequest();
  const url = `/communitys/Board_search`;
  xhr.open("GET", `${url}/?searchType=${searchType}&input=${input}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var boardData = JSON.parse(xhr.responseText);
      console.log(boardData);
      updateBoardField(boardData);
    }
  };
  xhr.send();
};

// searchBtn, searchInput에 enter event 추가
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// updateBoardField (게시판 검색 결과를 보여주는 함수)
const updateBoardField = (boardData) => {
  const boardContainer = document.querySelector(".board-list");
  // 기존 데이터 초기화
  boardContainer.innerHTML = "";
  boardData.forEach( function (board) {
  const div1 = document.createElement("div");
  div1.classList.add("board-container");
  const a = document.createElement("a");
  a.href = `/communitys/${board.pk}/main/`;
  const img = document.createElement("img");
  if (board.thumbnail != "") {
    img.src = `${board.thumbnail}`;
    img.alt = "게시판 썸네일";
  } else {
    img.src = defaultImage;
    img.alt = "이미지 없음";
  }
  const div2 = document.createElement("div");
  div2.innerHTML = `${board.name}`;
  a.appendChild(img);
  a.appendChild(div2);
  div1.appendChild(a);
  boardContainer.appendChild(div1);
  });
};

// listBtn 클릭시 전체 게시판으로 이동
const getAllBoard = () => {
  var xhr = new XMLHttpRequest();
  const url = `/communitys/Board_search`;
  xhr.open("GET", `${url}/?searchType=all`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var boardData = JSON.parse(xhr.responseText);
      console.log(boardData);
      updateBoardField(boardData);
    }
  };
  xhr.send();
};

// listBtn 클릭시 전체 게시판으로 이동
listBtn.addEventListener("click", () => {
  getAllBoard();
});