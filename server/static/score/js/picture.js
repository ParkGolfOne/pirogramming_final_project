// 이미지 미리보기
function showImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function(e) {
      document.getElementById('preview').src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.getElementById('preview').src = "";
  }
}

//  이미지 파일 추출

//새 HTTPRequest 생성
const requestExtractImage = new XMLHttpRequest();

// 함수명 : extractPicture
// 전달인자 : --
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function extractPicture() {
  const fileInput = document.querySelector("#uploadedImage");
  const formData = new FormData();
  formData.append("image", fileInput.files[0])


  const url = `/score/scan_scorePaper/`;
  requestExtractImage.open("POST", url, true);
  requestExtractImage.setRequestHeader("X-Requested-With", "XMLHttpRequest");
 
  requestExtractImage.send(formData);
}

// 댓글 추가 요청 응답 온 후
requestExtractImage.onreadystatechange = () => {
  if (requestExtractImage.readyState === XMLHttpRequest.DONE) {
    if (requestExtractImage.status < 400) {
      const { par, score } = JSON.parse(requestExtractImage.response);

      parInputs = document.querySelectorAll('.parInput')
      scoreInputs = document.querySelectorAll('.scoreInput')

      let i = 0;
      parInputs.forEach(element=>{
        element.value = par[i];
        i += 1;
      })
      i = 0;
      scoreInputs.forEach(element=>{
        element.value = score[i];
        i += 1;
      })
    }
  }
};
