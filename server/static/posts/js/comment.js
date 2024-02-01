// 댓글 제거 부분

const requestCommentDelete = new XMLHttpRequest();

// 함수명 : deleteComment
// 전달인자 : post_id
// 기능 : 서버에 댓글 삭제 요청 및, 해당 post_id 전달
function deleteComment(comment_id) {
  const url = `/communitys/comment_delete/${comment_id}/`;
  requestCommentDelete.open("POST", url, true);
  requestCommentDelete.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestCommentDelete.send(JSON.stringify({ comment_id: comment_id }));
}

// 댓글 삭제 요청 응답 온 후
requestCommentDelete.onreadystatechange = () => {
  if (requestCommentDelete.readyState === XMLHttpRequest.DONE) {
    if (requestCommentDelete.status < 400) {
      const { comment_id } = JSON.parse(requestCommentDelete.response);
      const element = document.querySelector(`.Cid-${comment_id}`);
      element.remove();
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
      const { commenter, content, commentId, post_id } = JSON.parse(
        requestCommentAdd.response
      );
      const element = document.querySelector(".commentSection");
      let originHTML = element.innerHTML;
      element.innerHTML += `<div class="a_comment Cid-${commentId}">
            <div class="a_comment_commenter">${commenter}</div>
            <div class="a_comment_content">${content}</div>
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
              class="a_comment_delete"
              onclick="likeComment(${commentId})"
            >
              좋아요
            </button>
            <button
              class="a_comment_reply"
              onclick="writeReply(${post_id}, ${commentId})"
            >
              답글
            </button>
            </div><section class="replySection"></section>`;
    }
  }
};

// 댓글 업데이트 부분
//새 HTTPRequest 생성
const requestCommentUpdate = new XMLHttpRequest();

// 함수명 : updateComment
// 전달인자 : comment_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function updateComment(comment_id) {
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
      const { commenter, content, commentId, post_id } = JSON.parse(
        requestCommentUpdate.response
      );
      const element = document.querySelector(`.Cid-${commentId}`);
      element.innerHTML = `<div class="a_comment_commenter">${commenter}</div>
            <div class="a_comment_content">${content}</div>
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
              class="a_comment_delete"
              onclick="likeComment(${commentId})"
            >
              좋아요
            </button>
            <button
              class="a_comment_reply"
              onclick="writeReply(${post_id}, ${commentId})"
            >
              답글
            </button><section class="replySection"></section>`;
    }
  }
};

// 함수명 : updateCommentBtn
// 전달인자 : comment_id
// 기능 : 댓글 업데이트 버튼 입력시 input 칸으로 변경
function updateCommentBtn(comment_id) {
  const element = document.querySelector(`.Cid-${comment_id}`);
  element.innerHTML = `<div class="input-area">
        <input type="text" class="comment-update-box" /><button
          class="comment-upload-btn"
          onclick="updateComment(${comment_id})"
        >
          수정
        </button>
      </div>`;
}
