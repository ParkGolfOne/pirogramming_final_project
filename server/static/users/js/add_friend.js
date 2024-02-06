const candidateListField = document.getElementById("candidate_list");

function addFriend(friend_id, pk) {
  console.log("addFriend 함수 실행");
  const form = document.getElementById("add_friend-form");
  const formData = new FormData(form);
  formData.append("friend", friend_id);

  const url = `/users/add_friend/${pk}/`;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4 && xhr.status === 200) {
      const data = JSON.parse(xhr.responseText);
      console.log("data", data);
      updateCandidateList(data, pk);
      console.log("친구 추가 완료");
    }
  }
  xhr.send(formData);
}

function updateCandidateList(data, userId) {
  candidateListField.innerHTML = "";
  data.forEach((friend) => {
    const li = document.createElement("li");
    li.innerHTML = `사용자 id: ${friend.username} 사용자 닉네임: ${friend.nickname}`;
    const form = document.createElement("form");
    form.setAttribute("method", "post");
    form.setAttribute("action", `/users/add_friend/${userId}/`);
    form.setAttribute("id", "add_friend-form");
    form.innerHTML = `<input type="hidden" name="friend_id" value=${friend.id}>
      <button type="button" onclick="addFriend(${friend.id}, ${userId})">친구 추가</button>`;
    
    li.appendChild(form);
    candidateListField.appendChild(li);
  });
}
