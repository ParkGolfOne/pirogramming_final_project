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
      updateCandidateList(data.friend_id, pk);
      console.log("친구 추가 완료");
    }
  };
  xhr.send(formData);
}

// 친구 추가 이후 바뀌는 화면
function updateCandidateList(friend_id) {
  var liElements = candidateListField.getElementsByTagName("li");

  for (var i = 0; i < liElements.length; i++) {
    var inputElement = liElements[i].querySelector(`input[name="friend_id"]`);
    if (inputElement && inputElement.value === friend_id) {
      liElements[i].remove();
      break; // 값을 찾았으면 반복문을 종료
    }
  }
}