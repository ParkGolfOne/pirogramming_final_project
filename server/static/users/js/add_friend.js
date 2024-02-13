const candidateListField = document.querySelector("#id_search .candidate_list");
function addFriend(friend_id, pk, event) {

  // 이벤트가 발생한 요소의 부모 요소의 클래스 이름 확인
  const parentDiv = event.target.closest(".search");
  const parentId = parentDiv.id;

  if (parentId == "id_search") {
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
        updateCandidateList(data.friend_id);
      }
    };
    xhr.send(formData);
  } else {
    const candidateListField = document.querySelector(
      "#email_search .candidate_list"
    );
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
        delCandidateList(candidateListField);
      }
    };
    xhr.send(formData);
  }
}

// 친구 추가 이후 바뀌는 화면 (id)
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

// 친구 추가 이후 바뀌는 화면 (email)
function delCandidateList(candidateListField) {
  candidateListField.innerHTML = "";
}
