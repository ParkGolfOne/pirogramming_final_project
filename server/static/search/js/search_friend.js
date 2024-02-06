const searchInput = document.querySelector("#friend_search_input");
const relContainer = document.querySelector(".rel_search");
const ul = document.querySelector(".pop_rel_friend");

searchInput.addEventListener("change", displayInputValue);
searchInput.addEventListener("keyup", displayInputValue);


// displayInputValue
function displayInputValue() {
  if (searchInput.value === "") {
    relContainer.classList.add("hide");
  } else {
    relContainer.classList.remove("hide");
    loadData(searchInput.value);
  }
}

// loadData
const loadData = (input) => {
  var xhr = new XMLHttpRequest();

  const url = `/search/search_candidate`;
  xhr.open("GET", `${url}/?input=` + input, true);
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
      <button type="button" onclick="addFriend(${friend.id}, ${userId})">친구 추가</button>`;
    li.appendChild(form);
    
    // form.addEventListener("mousedown", function () {
    //   addFriend(friend.id, userId);
    // });

    ul.appendChild(li);
  });
};

