const main = document.querySelector(".container-countries");
function initial() {
  const fetchPromise = fetch("https://restcountries.eu/rest/v2/all");
  fetchPromise.then(response => {
    return response.json();
  }).then(countries => {
    main.insertAdjacentHTML("afterbegin", displayCountries(countries, 8));
  });
}
initial();
let searchToggle = document.querySelector(".container-tools-search");
let filterToggle = document.querySelector(".container-tools-filter");
let backToggle = document.querySelector(".container-tools-back");
document.querySelector("#search").addEventListener("keyup", function (event) {
  searchCountries(this.value);
  event.preventDefault();
})
document.querySelector("#filter").addEventListener("click", function (event) {
  window.location.hash = "f" + event.target.innerHTML;
  filterCountries(event.target.innerHTML);
})
function displayCountries(countries, count) {
  if (localStorage.getItem("alpha3codes") == null) {
    localStorage.setItem("alpha3codes", `${JSON.stringify(countries)}`)
  }
  document.querySelector(".loader").style.display = "block";
  const names = countries.slice(0, count).map(country => `<div class="container-country wrapper" data-attr="${country.name}">
  <div class="container-country--flag" ><img src="${country.flag}"></div>
  <div class="container-country--name">
      <h3>${country.name}</h3>
  </div>
  <div class="container-country--populatoin">
      <p><span>Population:</span> ${formatNumber(country.population)}</p>
  </div>
  <div class="container-country--region">
      <p><span>Region:</span> ${country.region}</p>
  </div>
  <div class="container-country--capital">
      <p><span>Capital:</span>${country.capital}</p>
  </div>
</div>`).join("\n");
  document.querySelector(".loader").style.display = "none";
  return `${names}`
}
function displaySingleCountry(singleCountry) {
  document.querySelector(".loader").style.display = "block";
  const name = singleCountry.map(country => `
    <div class="container-countries-single container-countries-single--flag"><img
            src="${country.flag}" alt="">
    </div>
    <div class="container-countries-single container-countries-single--info">
        <div class="container-countries-single--heading">${country.name}</div>
        <ul>
            <li><span>Native Name:</span>${country.nativeName}</li>
            <li><span>Population:</span>${formatNumber(country.population)}</li>
            <li><span>Region:</span>${country.region}</li>
            <li><span>Sub Region:</span>${country.subregion}</li>
            <li><span>Capital:</span>${country.capital}</li>
        </ul>
        <ul>
            <li><span>Top Level Domain:</span>${country.topLevelDomain}</li>
            <li><span>Currencies:</span>${country.currencies[0].name}</li>
            <li><span>Languages</span>${country.languages[0].name}</li>
        </ul>
        <ul class="last-list">
            <li><span>Border Countries:</span></li>
            <li class="wrapper">${borderCountryList(country.borders)}</li>
        </ul>
    </div>
`).join("\n");
  document.querySelector(".loader").style.display = "none";
  return `${name}`
}
function borderCountryList(cdlist) {
  const mna = cdlist.toString().split(",");
  const cdliobj = JSON.parse(localStorage.getItem("alpha3codes"));
  let licd = [];
  for (i = 0; i < mna.length; i++) {
    for (j = 0; j < cdliobj.length; j++) {
      if (cdliobj[j].alpha3Code == mna[i]) {
        licd.push(cdliobj[j].name);
      }
      else {
        continue;
      }
    }
  }
  let ncon = licd.join("</li><li class='wrapper'>")
  return ncon;
}
function formatNumber(num) {
  return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
document.querySelector("section.container-countries").addEventListener("click", function (event) {
  if (event.target.closest(".container-country") != null) {
    searchToggle.style.display = "none";
    filterToggle.style.display = "none";
    backToggle.style.display = "block";
    let target = event.target.closest(".container-country").getAttribute("data-attr");
    singleCountry(target);
  }
  event.preventDefault();
})
document.querySelector(".container-tools-back").addEventListener("click", function () {
  let loc = window.location.hash;
  let resTpe = loc[1];
  let resName = loc.substring(2).split("~");
  main.innerHTML = ""
  if (resName.length > 1) {
    singleCountry(resName[resName.length - 1])
    console.log(resName.length);
    window.location.hash = loc.slice(0, loc.lastIndexOf("~"));

  }
  else {
    searchToggle.style.display = "block";
    filterToggle.style.display = "block";
    backToggle.style.display = "none";
    if (resTpe == "s") {
      searchCountries(resName[0]);
    }
    else if (resTpe == "f") {
      filterCountries(resName[0]);
    }
    else if (resTpe == "d") {
      initial();
      history.replaceState(null, null, ' ');
    }
    else {
      initial();
    }
  }
})
function searchCountries(target) {
  if (target != "") {
    window.location.hash = "s" + target;
    const fetchSearchPromise = fetch("https://restcountries.eu/rest/v2/name/" + target);
    fetchSearchPromise.then(response => {
      return response.json();
    }).then(countries => {
      main.innerHTML = "";
      main.insertAdjacentHTML("afterbegin", displayCountries(countries, 8));
    });
  }
}
function filterCountries(target) {
  const fetchFilterPromise = fetch("https://restcountries.eu/rest/v2/region/" + target);
  fetchFilterPromise.then(response => {
    return response.json();
  }).then(countries => {
    main.innerHTML = "";

    main.insertAdjacentHTML("afterbegin", displayCountries(countries, 8));
  });

}
const toggleBtn = document.querySelector("#toggle-theme");
toggleBtn.addEventListener('click', (e) => {
  if (document.documentElement.hasAttribute('theme')) {
    document.documentElement.removeAttribute('theme');
  }
  else {
    document.documentElement.setAttribute('theme', 'dark');
  }
});
function singleCountry(target) {
  const fetchFilterPromise = fetch(`https://restcountries.eu/rest/v2/name/${target}?fullText=true`);
  fetchFilterPromise.then(response => {
    return response.json();
  }).then(countries => {
    main.innerHTML = "";
    main.insertAdjacentHTML("afterbegin", displaySingleCountry(countries));
  });
}
main.addEventListener("click", (event) => {
  if (event.target.closest("li.wrapper") != null) {
    let borderc = event.target.closest("li.wrapper").innerHTML;
    singleCountry(borderc);
    if (window.location.hash == "") {
      window.location.hash = "d" + borderc;
    }
    else {
      window.location.hash += "~" + borderc;
    }
  }
})
