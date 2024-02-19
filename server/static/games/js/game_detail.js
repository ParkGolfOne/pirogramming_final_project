const elements = document.querySelectorAll('.scoreForm');

elements.forEach(function(element) {
  element.addEventListener('submit', function(e) {
    e.preventDefault(); 
    
    let formData = new FormData(this);
    
    fetch(this.action, {
        method: 'POST',
        body: formData,
        headers: {
            'X-CSRFToken': document.querySelector('[name=csrfmiddlewaretoken]').value,
        },
    })
    .then(response => {
        if(response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        console.log(data);
        alert('저장되었습니다.'); 
        const button = this.querySelector('.Btn.game-myscore'); 
        button.disabled = true;
        button.value = '저장 완료'; 
    })
    .catch(error => console.error('Error:', error));
  });
});