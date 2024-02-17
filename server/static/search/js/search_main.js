// 검색 값
const search_input = document.querySelector(".search_input")

// 추천 값 보여주는 영역
const match_content = document.querySelector(".match_content");



// 함수명 : update_match_content
// 전달인자 : --
// 기능 : 추천 결과 보여주기
function update_match_content(search_result){
    match_content.innerHTML = "";
    console.log("update_match_content 안에 있는 search_result : ", search_result)
    search_result.forEach((result)=>{
        if(result.type == "게시글"){
            console.log("게시글")
            match_content.innerHTML += `
            <li class="search_result">
                <a href="/communitys/${result.bid}/main/${result.pid}">
                    <div class="result-title">${result.title} </div>
                    <span>( ${result.bname} )</span>
                    <span>${result.type}</span>
                </a>
            </li>
            `;
        }
        else if(result.type == "골프장"){
            console.log("골프장")
            match_content.innerHTML += `
            <li class="search_result">
                <a href="/locations/detail/${result.lid}">
                    <div class="result-title">${result.lname}</div>
                    <span>${result.addr}</span>
                    <span>${result.type}</span>
                </a>
            </li>
            `;
        }
    })

}





// 함수명 : search_content
// 전달인자 : --    
// 기능 : 해당 검색명의 무언가가 있는지 체크
function search_content(input){

    var xhr = new XMLHttpRequest();     
    const url = `/search/main_search`;
    xhr.open(
        "GET",
        `${url}/?input=${input}&count=3`,
        true
    );
    xhr.onreadystatechange = function () {
        if (xhr.readyState == 4 && xhr.status == 200) {
            const { search_result } = JSON.parse(xhr.response);
            update_match_content(search_result)
        }
    };
    xhr.send();

}


search_input.addEventListener("input", (input) => {search_content(input.data)});
