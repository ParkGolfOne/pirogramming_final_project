document.addEventListener("DOMContentLoaded", function() {
  function hideAllPages() {
    document.querySelectorAll('.user-mypage').forEach(function(page) {
      page.style.display = 'none';
    });
  }

  function showPage(pageId) {
    hideAllPages();
    document.getElementById(pageId).style.display = 'block';
  }

  // 클릭 이벤트 리스너 추가
  const listItems = document.querySelectorAll('.user-btn-option li');
  listItems.forEach(function(li) {
    li.addEventListener('click', function() {
      listItems.forEach(function(item) {
        item.classList.remove('active');
      });
      this.classList.add('active'); // 클릭된 li태그에만 active

      showPage(this.getAttribute('data-target'));
    });
  });

  // 화면에 접속했을 때는 좋아요 누른 글이 보임
  const initialActiveItem = document.querySelector('.user-btn-option li[data-target="likes"]');
  if (initialActiveItem) {
    initialActiveItem.classList.add('active');
    showPage(initialActiveItem.getAttribute('data-target'));
  }
});
