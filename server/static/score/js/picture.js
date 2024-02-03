// 이미지 미리보기
function showImage(image) {
  if (image.files && image.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      $("#blah").attr("src", e.target.result);
    };
    reader.readAsDataURL(image.files[0]);
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
  console.log(fileInput.files);
  const formData = new FormData();
  formData.append("image", fileInput.files[0]);

  const url = `/score/scan_scorePaper/`;
  requestExtractImage.open("POST", url, true);
  requestExtractImage.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  console.log(formData);
  requestExtractImage.send(formData);
}

// 댓글 추가 요청 응답 온 후
requestExtractImage.onreadystatechange = () => {
  if (requestExtractImage.readyState === XMLHttpRequest.DONE) {
    if (requestExtractImage.status < 400) {
      const { text } = JSON.parse(requestExtractImage.response);
    }
    console.log(text);
  }
};
