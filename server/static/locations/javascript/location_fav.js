//즐겨찾기 함수 부분
const requestFav = new XMLHttpRequest();
function pushFav(location_id) {
  const favbutton = document.querySelector(`.fav-${location_id}`);
  favbutton.classList.toggle("faved");
  const url = "/locations/favorites/";
  requestFav.open("POST", url, true);
  requestFav.setRequestHeader(
    "Content-Type",
    "application/x-www-form-urlencoded"
  );
  requestFav.send(JSON.stringify({ location_id: location_id }));
}

requestFav.onreadystatechange = () => {
  if (requestFav.readyState === XMLHttpRequest.DONE) {
    if (requestFav.status < 400) {
      const { location_id, favNum, favTag } = JSON.parse(requestFav.response);
      const element = document.querySelector(`.favNum-${location_id}`);
      const originHTML = element.innerHTML;
      const [text, favnum] = originHTML.split(" ");
      let newnum = 0;

      if (favTag == "faved") {
        newnum = Number(favnum) + 1;
      } else {
        newnum = Number(favnum) - 1;
      }

      element.innerHTML = `추천 ${newnum}`;
    }
  }
};
