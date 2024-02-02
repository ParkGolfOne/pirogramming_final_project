// 대댓글 열람 부분

//새 HTTPRequest 생성
const requestReplyOpen = new XMLHttpRequest();

// 함수명 : writeReply
// 전달인자 : post_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function openReply(post_id, parent_comment_id) {
  const url = `/communitys/comment_create/`;
  requestReplyOpen.open("POST", url, true);
  requestReplyOpen.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestReplyOpen.send(
    JSON.stringify({
      post_id: post_id,
      parent_comment_id: parent_comment_id,
    })
  );
}

// 대댓글 열람 요청 응답 온 후
requestReplyOpen.onreadystatechange = () => {
  if (requestReplyOpen.readyState === XMLHttpRequest.DONE) {
    if (requestReplyOpen.status < 400) {
      const { commenter, content, commentId, post_id } = JSON.parse(
        requestReplyOpen.response
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
              onclick="replyComment(${post_id}, ${commentId})"
            >`;
    }
  }
};

// 대댓글 탭 닫기
function closeReply(post_id, parent_comment_id) {
  const content = document.querySelector(".comment-input-box");
}

// 대댓글 추가 부분

//새 HTTPRequest 생성
const requestReplyAdd = new XMLHttpRequest();

// 함수명 : writeReply
// 전달인자 : post_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function writeReply(post_id, parent_comment_id) {
  const content = document.querySelector(".comment-input-box");

  const url = `/communitys/comment_create/`;
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
}

// 대댓글 추가 요청 응답 온 후
requestReplyAdd.onreadystatechange = () => {
  if (requestReplyAdd.readyState === XMLHttpRequest.DONE) {
    if (requestReplyAdd.status < 400) {
      const { commenter, content, commentId, post_id } = JSON.parse(
        requestReplyAdd.response
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
            </button>`;
    }
  }
};
