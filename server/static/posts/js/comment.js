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
      // const { commenter, content, commentId, post_id } = JSON.parse(
      //   requestCommentAdd.response
      // );
      const { content, commentId, post_id } = JSON.parse(
        requestCommentAdd.response
      );
      const element = document.querySelector(".commentSection");
      let originHTML = element.innerHTML;
      element.innerHTML += `<div class="a_comment Cid-${commentId}">
          <div class="a_comment_commenter">commenter</div>
          <div class="a_comment_content">${content}</div>
          <button
            class="a_comment_delete"
            onclick="deleteComment(${commentId})"
          >
            삭제
          </button>
          <button
            class="a_comment_delete"
            onclick="updateComment(${commentId})"
          >
            수정
          </button>
          <button
            class="a_comment_delete"
            onclick="updateComment(${commentId})"
          >
            좋아요
          </button>
          <button
            class="a_comment_reply"
            onclick="replyComment(${post.id}, ${commentId})"
          >
            답글
          </button>
          </div>`;
    }
  }
};

// 대댓글 열람 부분

//새 HTTPRequest 생성
const requestReplyAdd = new XMLHttpRequest();

// 함수명 : writeReply
// 전달인자 : post_id
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function openReply(post_id, parent_comment_id) {
  const url = `/communitys/comment_create/`;
  requestReplyAdd.open("POST", url, true);
  requestReplyAdd.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestReplyAdd.send(
    JSON.stringify({
      post_id: post_id,
      parent_comment_id: parent_comment_id,
    })
  );
}

// 대댓글 열람 요청 응답 온 후
requestReplyAdd.onreadystatechange = () => {
  if (requestReplyAdd.readyState === XMLHttpRequest.DONE) {
    if (requestReplyAdd.status < 400) {
      // const { commenter, content, commentId, post_id } = JSON.parse(
      //   requestReplyAdd.response
      // );
      const { content, commentId, post_id, flag } = JSON.parse(
        requestReplyAdd.response
      );
      const element = document.querySelector(".commentSection");
      let originHTML = element.innerHTML;
      element.innerHTML += `<div class="a_comment Cid-${commentId}">
          <div class="a_comment_commenter">commenter</div>
          <div class="a_comment_content">${content}</div>
          <button
            class="a_comment_delete"
            onclick="deleteComment(${commentId})"
          >
            삭제
          </button>
          <button
            class="a_comment_delete"
            onclick="updateComment(${commentId})"
          >
            수정
          </button>
          <button
            class="a_comment_delete"
            onclick="updateComment(${commentId})"
          >
            좋아요
          </button>
          <button
            class="a_comment_reply"
            onclick="replyComment(${post.id}, ${commentId})"
          >`;
    }
  }
};

// 대댓글 탭 닫기
function closeReply(post_id, parent_comment_id) {
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
      // const { commenter, content, commentId, post_id } = JSON.parse(
      //   requestReplyAdd.response
      // );
      const { content, commentId, post_id, flag } = JSON.parse(
        requestReplyAdd.response
      );
      const element = document.querySelector(".commentSection");
      let originHTML = element.innerHTML;
      element.innerHTML += `<div class="a_comment Cid-${commentId}">
          <div class="a_comment_commenter">commenter</div>
          <div class="a_comment_content">${content}</div>
          <button
            class="a_comment_delete"
            onclick="deleteComment(${commentId})"
          >
            삭제
          </button>
          <button
            class="a_comment_delete"
            onclick="updateComment(${commentId})"
          >
            수정
          </button>
          <button
            class="a_comment_delete"
            onclick="updateComment(${commentId})"
          >
            좋아요
          </button>
          <button
            class="a_comment_reply"
            onclick="replyComment(${post.id}, ${commentId})"
          >`;
    }
  }
};
