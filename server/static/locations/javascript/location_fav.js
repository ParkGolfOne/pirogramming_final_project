//즐겨찾기 함수 부분
const requestFav = new XMLHttpRequest();
function pushFav(location_id) {
  // 즐겨찾기 버튼
  const favbutton = document.querySelector(`.fav-${location_id}`);
  // 즐겨찾기 숫자 칸
  const element = document.querySelector(`.favNum-${location_id}`);
  favbutton.classList.toggle("faved");
  if (favbutton.classList.contains("faved")){
    element.innerHTML = Number(element.innerHTML) + 1
  }
  else{
    element.innerHTML = Number(element.innerHTML) - 1
  }
  favbutton.disabled = true;
  const url = "/locations/favorites/";
  requestFav.open("POST", url, true);
  requestFav.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestFav.send(JSON.stringify({ location_id: location_id }));


  requestFav.onreadystatechange = () => {
    if (requestFav.readyState === XMLHttpRequest.DONE) {
      if (requestFav.status < 400) {
        const { favNum } = JSON.parse(requestFav.response);
   
        element.innerHTML = `${favNum}`;

        favbutton.disabled = false;
      }
    }
  };
  
}

