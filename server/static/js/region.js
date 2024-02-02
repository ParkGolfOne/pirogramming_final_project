document.addEventListener("DOMContentLoaded", function () {
  var cityField = document.getElementById("id_city");
  var townField = document.getElementById("id_town");

  cityField.addEventListener("change", function () {
    var selectedCity = cityField.value;

    // Ajax 요청
    var xhr = new XMLHttpRequest();
    xhr.open("GET", "/users/get_town_list/?city=" + selectedCity, true);
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4 && xhr.status == 200) {
        var townData = JSON.parse(xhr.responseText);
        updateTownField(townData);
      }
    };
    xhr.send();
  });

  function updateTownField(townData) {
    townField.innerHTML = "";

    // 받아온 town 데이터를 option 태그로 만들어서 추가함
    townData.forEach(function (town) {
      var option = document.createElement("option");
      option.value = town;
      option.text = town;
      townField.appendChild(option);
    });
  }
});
