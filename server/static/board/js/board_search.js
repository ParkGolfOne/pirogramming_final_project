const searchInput = document.querySelector("#board_search_input");
const searchBtn = document.querySelector("#board_search_btn");
const listBtn = document.querySelector("#board_list_btn");
const searchType = document.querySelector("#board_search_select");

const handleSearch = () => {
  if (searchInput.value === "") {
    alert("검색어를 입력해주세요");
    return;
  } else {
    getSearchResult(searchInput.value, searchType.value);
  }
};

const getSearchResult = (input, searchType) => {
    var xhr = new XMLHttpRequest();
}