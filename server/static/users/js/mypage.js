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

  // 모든 li 태그에 대해 클릭 이벤트 리스너 추가
  const listItems = document.querySelectorAll('.user-btn-option li');
  listItems.forEach(function(li) {
    li.addEventListener('click', function() {
      // 모든 li태그에서 active 클래스 제거
      listItems.forEach(function(item) {
        item.classList.remove('active');
      });

      // 클릭된 li태그에 active 클래스 추가
      this.classList.add('active');

      // 해당하는 페이지 표시
      showPage(this.getAttribute('data-target'));
    });
  });

  // 초기 설정: "좋아요"에 해당하는 li 태그 활성화
  const initialActiveItem = document.querySelector('.user-btn-option li[data-target="likes"]');
  if (initialActiveItem) {
    initialActiveItem.classList.add('active'); // 초기 활성화 상태 적용
    showPage(initialActiveItem.getAttribute('data-target')); // 초기에 표시할 페이지
  }
});
