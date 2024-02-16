// 댓글 제거 부분

const requestCommentDelete = new XMLHttpRequest();

// 함수명 : deleteComment
// 전달인자 : post_id
// 기능 : 서버에 댓글 삭제 요청 및, 해당 post_id 전달 ---> 대댓글도 이 함수로 실행
function deleteComment(comment_id) {
  const url = `/communitys/comment_delete/${comment_id}/`;
  requestCommentDelete.open("POST", url, true);
  requestCommentDelete.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestCommentDelete.send(JSON.stringify({ comment_id: comment_id }));
}

// 댓글 삭제 요청 응답 온 후.... 대댓글도 가능
requestCommentDelete.onreadystatechange = () => {
  if (requestCommentDelete.readyState === XMLHttpRequest.DONE) {
    if (requestCommentDelete.status < 400) {
      const { comment_id, isReply} = JSON.parse(requestCommentDelete.response);
      const element = document.querySelector(`.Cid-${comment_id}`);
      element.remove();
      // 원댓글이 아닐 경우
      if (isReply != 0){
        // isReply 는 해당 댓글의 부모의 id 값
        const showReplybtn = document.querySelector(`.showReply-${isReply}`)
        const [text1, child_num, text2] = showReplybtn.innerHTML.split(" ");
        if (child_num == 1){
          showReplybtn.remove()
        }
        else{
          showReplybtn.innerHTML = `-답글 ${Number(child_num) - 1} 개-`
          showReplybtn.addEventListener("click", (event)=>{
            const target = event.target;
            const replyArea = target.parentNode.nextElementSibling;
            console.log(replyArea)
            console.log( window.getComputedStyle(replyArea).style.display)

            replyArea.style.display = (window.getComputedStyle(replyArea).style.display === 'flex') ? 'none' : 'flex';
            console.log("삭제후 표시 토글")
          })
        }
      }
    }
  }
};

// 댓글 추가 부분

//새 HTTPRequest 생성
const requestCommentAdd = new XMLHttpRequest();

// 함수명 : writeComment
// 전달인자 : post_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function writeComment(post_id) {
  const content = document.querySelector(".comment-input-box");

  const url = `/communitys/comment_create/`;
  requestCommentAdd.open("POST", url, true);
  requestCommentAdd.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestCommentAdd.send(
    JSON.stringify({
      post_id: post_id,
      content: content.value,
    })
  );
  content.value = "";
}

// 댓글 추가 요청 응답 온 후
requestCommentAdd.onreadystatechange = () => {
  if (requestCommentAdd.readyState === XMLHttpRequest.DONE) {
    if (requestCommentAdd.status < 400) {
      const { commenter, content, commentId, post_id, profile } = JSON.parse(
        requestCommentAdd.response
      );
      const element = document.querySelector(".commentSection");
      let originHTML = element.innerHTML;
      element.innerHTML += `
      <div class="a_comment Cid-${commentId}">
        <div class="a_comment_commenter_profile">
          <img class="a_comment_commenter_image" src="${profile}"></img>
          <div class="a_comment_commenter">${commenter}</div>
        </div>
        <div class="a_comment_content">${content}</div>
        <div class="comment-btns">
          <button
            class="a_comment_delete"
            onclick="deleteComment(${commentId})"
          >
            삭제
          </button>
          <button
            class="a_comment_delete"
            onclick="updateCommentBtn(${commentId})"
          >
            수정
          </button>
          <button
            class="a_comment_reply"
            onclick="showReplyInput(${post_id}, ${commentId})"
          >
            답글
          </button>
        </div>
        <div>
          <div class="showReplyBtnArea-${commentId}"></div>
          <div class="replySection replyTo-${commentId}"></div>
        </div>
      </div>`;

    }
  }
};

// 댓글 업데이트 부분
//새 HTTPRequest 생성
const requestCommentUpdate = new XMLHttpRequest();

// 함수명 : updateComment
// 전달인자 : comment_id
// 기능 : 서버에 댓글 수정 요청 및 댓글 내용 전달  ---> 대댓글도 이 함수로 실행
function updateComment(comment_id) {
  //기존 댓글
  const content = document.querySelector(".comment-update-box");

  const url = `/communitys/comment_update/${comment_id}/`;
  requestCommentUpdate.open("POST", url, true);
  requestCommentUpdate.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestCommentUpdate.send(
    JSON.stringify({
      comment_id: comment_id,
      content: content.value,
    })
  );
  content.value = "";
}

// 댓글 업데이트 요청 응답 온 후
requestCommentUpdate.onreadystatechange = () => {
  if (requestCommentUpdate.readyState === XMLHttpRequest.DONE) {
    if (requestCommentUpdate.status < 400) {
      const { content, commentId,ifReply} = JSON.parse(
        requestCommentUpdate.response
      );
      const element = document.querySelector(`.Cid-${commentId}`);
      if (ifReply){ const new_content = element.querySelector('.a_reply_content');  new_content.innerHTML = `${content}`;}
      else{ const new_content = element.querySelector('.a_comment_content'); new_content.innerHTML = `${content}`;}
      
    }
  }
};

// 함수명 : updateCommentBtn
// 전달인자 : comment_id
// 기능 : 댓글 업데이트 버튼 입력시 input 칸으로 변경
function updateCommentBtn(comment_id) {
  const element = document.querySelector(`.Cid-${comment_id}`);
  const commentElement = element.querySelector(".a_comment_content");
  commentElement.innerHTML = `<div class="input-area">
        <input type="text" class="comment-update-box" value="${commentElement.innerHTML}"/><button
          class="comment-upload-btn"
          onclick="updateComment(${comment_id})"
        >
          수정
        </button>
      </div>`;
}

// 함수명 : updateReplyBtn
// 전달인자 : comment_id
// 기능 : 대댓글 업데이트 버튼 입력시 input 칸으로 변경
function updateReplyBtn(comment_id) {
  const element = document.querySelector(`.Cid-${comment_id}`);
  const replyElement = element.querySelector(".a_reply_content");
  replyElement.innerHTML = `<div class="input-area">
        <input type="text" class="comment-update-box" value="${replyElement.innerHTML}"/><button
          class="comment-upload-btn"
          onclick="updateComment(${comment_id})"
        >
          수정
        </button>
      </div>`;
}
