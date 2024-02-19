// search type (id, email) element
const searchTypeSelect = document.getElementById("search_type");

// 각각 id search input, email search input
const searchIdInput = document.querySelector("#id_search-input");
const searchEmailInput = document.querySelector("#email_search-input");

// default를 id search 버전으로 가져옴
let outputContainer = document.querySelector(".id_search-output");
let outputUl = document.querySelector(".id_search-output_item");

// select인 search type 변경 이벤트 리스너
searchTypeSelect.addEventListener("change", function () {
  const selectedValue = searchTypeSelect.value;
  console.log(selectedValue);

  // 선택된 옵션의 값에 따라 보여줄 HTML 선택
  if (selectedValue === "id") {
    document.getElementById("id_search").style.display = "block";
    document.getElementById("email_search").style.display = "none";
    searchInput = document.querySelector("#id_search-input");
    outputContainer = document.querySelector(".id_search-output");
    outputUl = document.querySelector(".id_search-output_item");
  } else if (selectedValue === "email") {
    document.getElementById("id_search").style.display = "none";
    document.getElementById("email_search").style.display = "block";
    searchInput = document.querySelector("#email_search-input");
    outputContainer = document.querySelector(".email_search-output");
    outputUl = document.querySelector(".email_search-output_item");
  } else {
    document.getElementById("id_search").style.display = "none";
    document.getElementById("email_search").style.display = "none";
  }
});

// 이벤트를 받으면 (input을 받으면,) 해당 입력값에 대해 검색 결과를 로드해주는 함수
function displayIdInputValue() {
  if (searchIdInput.value === "") {
    outputContainer.classList.add("hide");
  } else {
    outputContainer.classList.remove("hide");
    console.log(searchIdInput);
    loadData(searchIdInput.value);
  }
}
function displayEmailInputValue() {
  if (searchEmailInput.value === "") {
    outputContainer.classList.add("hide");
  } else {
    outputContainer.classList.remove("hide");
    console.log(searchEmailInput);
    loadData(searchEmailInput.value);
  }
}

// input 값 바뀌는 것을 받는 event listener
searchIdInput.addEventListener("input", displayIdInputValue);
searchEmailInput.addEventListener("input", displayEmailInputValue);

// loadData
// input 과 searchType을 view로 넘겨, 데이터들을 요청하는 함수
const loadData = (input) => {
  var xhr = new XMLHttpRequest();

  const url = `/search/search_users`;
  xhr.open(
    "GET",
    `${url}/?input=${input}&type=${searchTypeSelect.value}`,
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var userData = JSON.parse(xhr.responseText);
      console.log(userData);
      updateUsersField(userData);
    }
  };
  xhr.send();
};

function selectUser(userId, userUsername) {
  var selectElement = window.opener.window.popupArguments.selectElement;
  window.opener.setValue(selectElement, userId, userUsername);
  // 팝업 창 닫기
  window.close();
}

// view에서 받은 조건에 맞는 유저 목록을 보여줌
const updateUsersField = (userData) => {
  outputUl.innerHTML = "";

  userData.forEach(function (userItem) {
    const li = document.createElement("li");
    li.innerHTML = `사용자 id: ${userItem.username} 사용자 닉네임: ${userItem.nickname}`;
    const button = document.createElement("button");
    button.setAttribute(
      "onclick",
      `selectUser("${userItem.id}", "${userItem.username}")`
    );
    button.classList.add("choose_user-btn");
    button.innerHTML = "선택";

    li.appendChild(button);

    outputUl.appendChild(li);
  });
};
