const sortInput = document.querySelector("#post_sort_select");
console.log(sortInput.value);

sortInput.addEventListener("change", function () {
    getSortResult(boardId, sortInput.value);
    console.log(sortInput.value);
});

const getSortResult = (boardId, sortType) => {
  var xhr = new XMLHttpRequest();
  const url = `/communitys/${boardId}/sort_post`;
  xhr.open("GET", `${url}/?sortType=${sortType}`, true);
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4 && xhr.status == 200) {
      var postData = JSON.parse(xhr.responseText);
      updateAllPostField(postData); // search에서 모든 post를 가져오는 함수와 동일
    }
  };
  xhr.send();
};
