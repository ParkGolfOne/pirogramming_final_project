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
    loadData(searchInput.value, userId);
  }
}

// loadData
const loadData = (input, userId) => {
  var xhr = new XMLHttpRequest();

  const url = `/search/search_friend/${userId}`;
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
    var listItems = document.createElement("li");
    listItems.textContent = friend;

    listItems.addEventListener("mousedown", function () {
      searchInput.value = friend;
      ul.innerHTML = "";
    });
    ul.appendChild(listItems);
  });
};
