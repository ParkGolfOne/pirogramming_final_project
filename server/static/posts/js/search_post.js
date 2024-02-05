const searchInput = document.querySelector("#post_search_input");
const searchBtn = document.querySelector("#post_search_btn");
const listBtn = document.querySelector("#post_list_btn");
const searchType = document.querySelector("#post_search_select");


const handleSearch = () => {
  if (searchInput.value === "") {
    alert("검색어를 입력해주세요");
    return;
  } else {
    getSearchResult(boardId, searchInput.value, searchType.value);
  }
};

const getSearchResult = (boardId, input, searchType) => {
  var xhr = new XMLHttpRequest();
  const url = `/communitys/${boardId}/search_post`;
  xhr.open("GET", `${url}/?searchType=${searchType}&input=${input}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var postData = JSON.parse(xhr.responseText);
      //   var postArray = JSON.parse(postData);
      updatePostField(postData);
    }
  };
  xhr.send();
};

const updatePostField = (postArray) => {
  const postListContainer = document.querySelector(".postList");
  // 기존 데이터 초기화
  postListContainer.innerHTML = "";
  postArray.forEach(function (post) {
    var a = document.createElement("a");
    a.href = `/communitys/${post.board}/main/${post.pk}/`;
    a.classList.add("postDetailLink");
    var div1 = document.createElement("div");
    div1.innerHTML = post.title;
    var div2 = document.createElement("div");
    div2.innerHTML = post.writer;

    a.appendChild(div1);
    a.appendChild(div2);
    postListContainer.appendChild(a);
  });
};

// searchBtn, searchInput에 enter event 추가
searchBtn.addEventListener("click", handleSearch);
searchInput.addEventListener("keydown", function (event) {
  if (event.key === "Enter") {
    handleSearch();
  }
});

// listBtn 클릭시 전체 게시판으로 이동
const getAllPost = (boardId) => {
  var xhr = new XMLHttpRequest();
  const url = `/communitys/${boardId}/search_post`;
  xhr.open("GET", `${url}/?searchType=all`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var postData = JSON.parse(xhr.responseText);
      updateAllPostField(postData);
    }
  };
  xhr.send();
};

const updateAllPostField = (postArray) => {
  const postListContainer = document.querySelector(".postList");
  // 기존 데이터 초기화
  postListContainer.innerHTML = "";
  postArray.forEach(function (post) {
    var a = document.createElement("a");
    a.href = `/communitys/${post.board}/main/${post.pk}/`;
    a.classList.add("postDetailLink");
    var div1 = document.createElement("div");
    div1.innerHTML = post.title;
    var div2 = document.createElement("div");
    div2.innerHTML = post.writer;

    a.appendChild(div1);
    a.appendChild(div2);
    postListContainer.appendChild(a);
  });
};

// listBtn 클릭시 전체 게시판으로 이동
listBtn.addEventListener("click", () => {
  getAllPost(boardId);
});
