const searchTypeSelect = document.getElementById("search_type");

// default로는 id search 로 설정해둠
const searchIdInput = document.querySelector("#friend_id_search_input");
const searchEmailInput = document.querySelector("#friend_email_search_input");
let relContainer = document.querySelector("#id_search .rel_search");
let ul = document.querySelector("#id_search .pop_rel_friend");

// select 요소의 변경 이벤트 리스너 등록
searchTypeSelect.addEventListener("change", function () {
  const selectedValue = searchTypeSelect.value;

  // 선택된 옵션의 값에 따라 보여줄 HTML 선택
  if (selectedValue === "id") {
    document.getElementById("id_search").style.display = "block";
    document.getElementById("email_search").style.display = "none";
    searchInput = document.querySelector("#id_search #friend_search_input");
    relContainer = document.querySelector("#id_search .rel_search");
    ul = document.querySelector("#id_search .pop_rel_friend");
  } else if (selectedValue === "email") {
    document.getElementById("id_search").style.display = "none";
    document.getElementById("email_search").style.display = "block";
    searchInput = document.querySelector("#email_search #friend_search_input");
    relContainer = document.querySelector("#email_search .rel_search");
    ul = document.querySelector("#email_search .pop_rel_friend");
  } else {
    document.getElementById("id_search").style.display = "none";
    document.getElementById("email_search").style.display = "none";
  }
});

// displayInputValue
function displayIdInputValue() {
  if (searchIdInput.value === "") {
    relContainer.classList.add("hide");
  } else {
    relContainer.classList.remove("hide");
    console.log(searchIdInput);
    loadData(searchIdInput.value);
  }
}
function displayEmailInputValue() {
  if (searchEmailInput.value === "") {
    relContainer.classList.add("hide");
  } else {
    relContainer.classList.remove("hide");
    console.log(searchEmailInput);
    loadData(searchEmailInput.value);
  }
}
searchIdInput.addEventListener("input", displayIdInputValue);
searchEmailInput.addEventListener("input", displayEmailInputValue);

// loadData
const loadData = (input) => {
  var xhr = new XMLHttpRequest();

  const url = `/search/search_candidate`;
  xhr.open(
    "GET",
    `${url}/?input=${input}&type=${searchTypeSelect.value}`,
    true
  );
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var friendData = JSON.parse(xhr.responseText);
      updateFriendField(friendData);
    }
  };
  xhr.send();
};

const updateFriendField = (friendData) => {
  ul.innerHTML = "";

  friendData.forEach(function (friend) {
    const li = document.createElement("li");
    li.innerHTML = `사용자 id: ${friend.username} 사용자 닉네임: ${friend.nickname}`;
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", `/users/add_friend/${userId}/`);
    form.setAttribute("id", "add_friend-form");
    form.innerHTML = `<input type="hidden" name="friend_id" value=${friend.id}>
      <button type="button" class="add_friend-btn" onclick="addFriend(${friend.id}, ${userId}, event)">친구 추가</button>`;
    li.appendChild(form);
    ul.appendChild(li);
  });
};
