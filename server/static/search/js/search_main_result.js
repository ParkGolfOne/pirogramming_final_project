// 검색 아이콘 버튼 누를시 전체 검색 결과 페이지로 이동
function moveEntireResult(){
    window.location.href = `/search/main_search_result/?input=${document.querySelector(".search_input").value}`;
}
