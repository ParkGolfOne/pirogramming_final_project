function addFriend(friend_id, pk) {
  const form = document.getElementById("add_friend-form");
  const formData = new FormData(form);
  formData.append("friend", friend_id);

  const url = `/users/add_friend/${pk}/`;
  const xhr = new XMLHttpRequest();
  xhr.open("POST", url, true);
  xhr.setRequestHeader("X-Requested-With", "XMLHttpRequest");

  xhr.send(formData);
}
