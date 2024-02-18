// 대댓글 열람 부분
const openReplyBtns = document.querySelectorAll(".show_a_comment_reply")
openReplyBtns.forEach((btn)=>{
  btn.addEventListener("click", (event)=>{
    const target = event.target;
    const replyArea = target.parentNode.nextElementSibling;
    replyArea.style.display = (replyArea.style.display === 'flex') ? 'none' : 'flex';
  })
})


// 다른 대댓글 작성 방지 flag
let reCommentFlag = false;
// DeadLock 방지
setInterval(function() {
  reCommentFlag = false;
}, 60 * 1000);


// 대댓글 추가 부분

//새 HTTPRequest 생성
const requestReplyAdd = new XMLHttpRequest();

// 함수명 : writeReply
// 전달인자 : post_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function writeReply(post_id, parent_comment_id) {
  const content = document.querySelector(".reply-input-box");

  const url = `/communitys/reply_create/`;
  requestReplyAdd.open("POST", url, true);
  requestReplyAdd.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestReplyAdd.send(
    JSON.stringify({
      post_id: post_id,
      content: content.value,
      parent_comment_id: parent_comment_id,
    })
  );
  content.value = "";

  // 전송 요청 보냈으니 다른 댓글 작성 가능
  reCommentFlag = false;
}

// 대댓글 추가 요청 응답 온 후
requestReplyAdd.onreadystatechange = () => {
  if (requestReplyAdd.readyState === XMLHttpRequest.DONE) {
    if (requestReplyAdd.status < 400) {
      const { commenter, content, commentId, parent_cid, profile } = JSON.parse(
        requestReplyAdd.response
      );


      // 대댓글 해당 댓글 아래에 추가하기
      const replySection = document.querySelector(`.replyTo-${parent_cid}`);
      replySection.innerHTML += `
      <div class="a_reply Cid-${commentId}">
        <div class="a_reply_commenter_profile">
          <img class="a_reply_commenter_image" src="${profile}"></img>
          <div class="a_reply_commenter">${commenter}</div>
        </div>
        <div class="a_reply_content">${content}</div>
        <div class="comment-btns">
          <button
            class="a_comment_delete"
            onclick="deleteComment(${commentId})"
          >
            삭제
          </button>
          <button
            class="a_comment_delete"
            onclick="updateReplyBtn(${commentId})"
          >
            수정
          </button>
        </div>
       </div>`;

       // 답글 개수 수정하기
       const showReplyBtnArea = document.querySelector(`.showReplyBtnArea-${parent_cid}`)
       // 아무것도 없을 때
       if (showReplyBtnArea.innerHTML.trim() === ''){
        showReplyBtnArea.innerHTML = `<button class="show_a_comment_reply showReply-${parent_cid}">-답글 1 개-</button>`
        showReplyBtnArea.firstElementChild.addEventListener("click", (event)=>{
          const target = event.target;
          const replyArea = target.parentNode.nextElementSibling;
          replyArea.style.display = (replyArea.style.display === 'flex') ? 'none' : 'flex';
        })
       }
       //이미 있을 때
       else{
        let button_innerText = showReplyBtnArea.firstElementChild.innerHTML
        const [text1, child_num, text2] = button_innerText.split(" ");
        showReplyBtnArea.firstElementChild.innerHTML = `-답글 ${Number(child_num) + 1} 개-`
        showReplyBtnArea.firstElementChild.addEventListener("click", (event)=>{
          const target = event.target;
          const replyArea = target.parentNode.nextElementSibling;
          replyArea.style.display = (replyArea.style.display === 'flex') ? 'none' : 'flex';
        })
       }

      //  대댓글 입력칸 없애기
      const target_comment = document.querySelector(".reply-input-area")
      target_comment.remove()
    }
  }
};


//대댓글 입력 취소
function cancelReply(){
  reCommentFlag = false;
  //  대댓글 입력칸 없애기
  const target_comment = document.querySelector(".reply-input-area")
  target_comment.remove()
}


// 대댓글 입력창 추가
function showReplyInput(post_id, comment_id){
  // 대댓글 현재 작성 여부 체크
  if (reCommentFlag){
    alert("다른 수정중인 대댓글을 먼저 작성 완료해주세요!")
    return;
  }
  reCommentFlag = true;

  // 답글 누르면 자동으로 열리기
  const replyArea = document.querySelector(`.replyTo-${comment_id}`)
  replyArea.style.display = 'flex';
  // replyArea.style.display = (replyArea.style.display === 'flex') ? 'none' : 'flex';

  const target_comment = document.querySelector(`.Cid-${comment_id}`)
  target_comment.innerHTML += `
  <div class="reply-input-area">
    <input type="text" class="reply-input-box" />
    <button class="reply-upload-btn" onclick="writeReply(${post_id}, ${comment_id})">대댓글<br>등록</button>
    <button class="reply-upload-btn" onclick="cancelReply()">취소</button>
  </div>`
}
