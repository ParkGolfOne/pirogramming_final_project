// const NAVER_AUTH_URL = `https://nid.naver.com/oauth2.0/authorize?client_id=w0haveWbnc18S25mngGX&response_type=code&redirect_uri=http://127.0.0.1:8000/auth/complete/naver/`;

// const requestCode = new XMLHttpRequest();

// fetch("/users/check_naver_auth/")
//   .then((response) => response.json())
//   .then((data) => {
//     if (data.naver_account == true) {
//       console.log("User has Naver social auth.");

//       //   // 네이버 로그아웃 처리
//       //   const url = "/users/naver_logout/";

//       //   window.location.href = NAVER_AUTH_URL;
//       //   const code = new URL(window.location.href).searchParams.get("code");
//       //   console.log("code", code);

//       //   // code를 서버에 넘김
//       //   requestCode.open("POST", url, true); // POST 방식으로, 비동기 방식으로 보낼 거라고 명시함
//       //   requestCode.setRequestHeader(
//       //     "Content-Type",
//       //     "application/x-www-form-urlencoded"
//       //   );
//       //   requestCode.send(JSON.stringify({ code: code })); // json string 형식으로 변환
//       // 네이버 로그아웃 처리
//       const url = "/users/naver_logout/";

//       // 새 창에서 또는 iframe에서 로그아웃 처리
//       const popup = window.open(NAVER_AUTH_URL, "_blank");

//       // 새로 열린 창의 URL 얻기
//       //   const popupURL = popup.location.href;
//       const code = new URL(popup.location.href).searchParams.get("code");
//       console.log("Popup URL:", popup.location.href);
//       popup.close();
//       console.log("code", code);

//       // code를 서버에 넘김
//       requestCode.open("POST", url, true);
//       requestCode.setRequestHeader(
//         "Content-Type",
//         "application/x-www-form-urlencoded"
//       );
//       requestCode.send(JSON.stringify({ code: code }));
//     } 
//     else {
//       console.log("User does not have Naver social auth.");
//       // 다른 처리 수행
//     }
//   })
//   .catch((error) => {
//     console.error("Error checking Naver social auth:", error);
//   });

