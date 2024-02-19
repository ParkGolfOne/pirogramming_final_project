
// 받아온 이미지 압축
function reductImage(file){
  const reader = new FileReader(file);
            
  reader.onload = function (event) {
      const img = new Image();
      img.src = event.target.result;

      img.onload = function () {
          const canvas = document.createElement('canvas');
          const ctx = canvas.getContext('2d');
          const maxWidth = 800; // 원하는 최대 폭으로 조절
          const maxHeight = 600; // 원하는 최대 높이로 조절
          let newWidth = img.width;
          let newHeight = img.height;

          if (img.width > maxWidth || img.height > maxHeight) {
              const aspectRatio = img.width / img.height;
              if (aspectRatio > 1) {
                  newWidth = maxWidth;
                  newHeight = newWidth / aspectRatio;
              } else {
                  newHeight = maxHeight;
                  newWidth = newHeight * aspectRatio;
              }
          }

          canvas.width = newWidth;
          canvas.height = newHeight;


          console.log("canvas : ", canvas);

          ctx.drawImage(img, 0, 0, newWidth, newHeight);

          // 압축된 이미지를 얻기 위해 canvas.toDataURL을 사용할 수 있습니다.
          const compressedDataURL = canvas.toDataURL('image/jpeg', 0.7); // 0.7은 이미지 품질을 나타냅니다.

          // 압축된 이미지를 화면에 표시하거나 서버로 업로드할 수 있습니다.
          document.getElementById('preview').src = compressedDataURL;

          console.log("이미지 줄이는 함수")
          return compressedDataURL;

      };
  };

  reader.readAsDataURL(file);
}


var dragImage;

// 이미지 미리보기
function showImage(input) {
  if (input.files && input.files[0]) {
    var reader = new FileReader();
    reader.onload = function (e) {
      document.getElementById("preview").src = e.target.result;
    };
    reader.readAsDataURL(input.files[0]);
  } else {
    document.getElementById("preview").src =
      "/static/score/images/score_ex.PNG";
  }
}

// 이미지 드래그 앤 드랍
const pictureInputArea = document.querySelector("#fileInputArea");

/* Drag 한뒤 첫 번재 진입시*/
pictureInputArea.addEventListener("dragenter", function (e) {});

/* Drage 해서 박스 안에 포인터 있을 때*/
pictureInputArea.addEventListener("dragover", function (e) {
  // 제출 혹은 업로드 방지를 하기 위해서 아래의 preventDefault 사용
  e.preventDefault();

  this.style.backgroundColor = "#789461";
});

/* Drag 한 포인터가 박스 밖으로 나갈 때 */
pictureInputArea.addEventListener("dragleave", function (e) {
  this.style.backgroundColor = "rgba(0, 0, 0, 0)";
});

/* Drag 후 Drop 했을 때*/
pictureInputArea.addEventListener("drop", function (e) {
  // 제출 혹은 업로드 방지를 하기 위해서 아래의 preventDefault 사용
  e.preventDefault();

  dragImage = e.dataTransfer.files[0];
  showImage(e.dataTransfer);
  pictureInputArea.innerHTML = `<button class="imageDeleteBtn" onclick="deleteImage()">이미지 내리기</button>`;

  this.style.backgroundColor = "white";
});

//  이미지 파일 추출


//새 HTTPRequest 생성
const requestExtractImage = new XMLHttpRequest();

// 함수명 : extractPicture
// 전달인자 : --
// 기능 : 서버에 댓글 작성 요청 및 댓글 내용 전달
function extractPicture() {
  const fileInput = document.querySelector("#uploadedImage");
  const formData = new FormData();
  console.log("formData : ", formData)
  if (dragImage) {
    formData.append("image", dragImage);
    console.log("1");
  } else if (fileInput.files[0]) {
    formData.append("image", fileInput.files[0]);
    console.log("2");
  } else {
    alert("이미지가 업로드 되지 않았습니다.");
    console.log("3");
    return;
  }

  const url = `/score/scan_scorePaper/`;
  requestExtractImage.open("POST", url, true);
  requestExtractImage.setRequestHeader("X-Requested-With", "XMLHttpRequest");
  requestExtractImage.send(formData);

  var button = document.querySelector(".takePictureInfo");
  button.disabled = true;
  button.innerText = "분석중....";
}

// 이미지 분석 요청 응답 온 후
requestExtractImage.onreadystatechange = () => {
  if (requestExtractImage.readyState === XMLHttpRequest.DONE) {
    if (requestExtractImage.status < 400) {
      alert("분석 완료!");
      const { par, score } = JSON.parse(requestExtractImage.response);

      parInputs = document.querySelectorAll(".parInput");
      scoreInputs = document.querySelectorAll(".scoreInput");

      let i = 0;
      parInputs.forEach((element) => {
        element.value = par[i];
        i += 1;
      });
      i = 0;
      scoreInputs.forEach((element) => {
        element.value = score[i];
        i += 1;
      });

      var button = document.querySelector(".takePictureInfo");
      button.disabled = false;
      button.innerText = "이미지 분석";
    }
  }
};

// 업로드된 이미지 내리기
function deleteImage() {
  pictureInputArea.innerHTML = `<div class="pictureIcon"></div>
  <span>1개의 이미지를 끌어와 업로드하기!</span>
  <input
    type="file"
    id="uploadedImage"
    name="uploadedImage"
    onchange="showImage(this)"
    accept="image/*"
  />`;
  // 기본 이미지로 변경
  document.getElementById("preview").src = "/static/score/images/score_ex.PNG";

  console.log("이미지 삭제 실행");
  // drag된 이미지 초기화
  dragImage = "";
}
