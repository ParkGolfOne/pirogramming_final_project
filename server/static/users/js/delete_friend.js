const friendListField = document.querySelector(".friend-container");

function deleteFriend(friend_id, pk) {
  const form = document.getElementById("delete_friend-form");
  const formData = new FormData(form);
  formData.append("friend", friend_id);

  const url = `/users/delete_friend/${pk}/`;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log("data", data);
      updateFriendList(data, userId);
    }
  };
  xhr.send(formData);
}

function updateFriendList(data, userId) {
  friendListField.innerHTML = "";
  data.forEach((friend) => {
    const div = document.createElement("div");
    div.classList.add("row");
    const div1 = document.createElement("div");
    div1.classList.add("friend-image");
    div1.innerHTML = `<img src=${friend.image} class="friend-image">`;
    const div2 = document.createElement("div");
    div2.classList.add("friend-info");
    div2.innerHTML = `<p>ID: ${friend.username}</p>
        <p>닉네임: ${friend.nickname}</p>`;
    const div3 = document.createElement("div");
    div3.classList.add("friend-btn");
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", `/users/delete_friend/${userId}/`);
    form.setAttribute("id", "delete_friend-form");
    form.innerHTML = `<input type="hidden" name="friend_id" value=${friend.id}><button type="button" class="user-btn" onclick="deleteFriend(${friend.id}, ${userId})">친구 삭제</button>`;

    div3.appendChild(form);

    div.appendChild(div1);
    div.appendChild(div2);
    div.appendChild(div3);

    friendListField.appendChild(div);
  });
}

document
  .getElementById("addFriendButton")
  .addEventListener("click", function () {
    window.location.href = `/users/add_friend/${userId}`;
  });
