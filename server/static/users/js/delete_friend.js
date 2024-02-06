const friendListField = document.getElementById("friend_list");

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
  }
  xhr.send(formData);
}

function updateFriendList(data, userId) {
    friendListField.innerHTML = "";
    data.forEach((friend) => {
        const li = document.createElement("li");
        li.innerHTML = `사용자 id: ${friend.username} 사용자 닉네임: ${friend.nickname}`;
        const form = document.createElement("form");
        form.setAttribute("method", "post");
        form.setAttribute("action", `/users/delete_friend/${userId}/`);
        form.setAttribute("id", "delete_friend-form");
        form.innerHTML = `<input type="hidden" name="friend_id" value=${friend.id}><button type="button" onclick="deleteFriend(${friend.id}, ${userId})">친구 삭제</button>`;
        li.appendChild(form);
        friendListField.appendChild(li);
    });
}
