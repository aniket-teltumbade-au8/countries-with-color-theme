const main = document.querySelector(".container-countries");
function initial(){const fetchPromise = fetch("https://restcountries.eu/rest/v2/all");

fetchPromise.then(response => {
  return response.json();
}).then(countries => {
  main.insertAdjacentHTML("afterbegin",displayCountries(countries,8));
});
}
initial();


document.querySelector("#search").addEventListener("keyup",function(event){
console.log(this.value)
if(this.value!=""){
  const fetchSearchPromise = fetch("https://restcountries.eu/rest/v2/name/"+this.value);
  fetchSearchPromise.then(response => {
    return response.json();
  }).then(countries => {
    main.innerHTML="";
    main.insertAdjacentHTML("afterbegin",displayCountries(countries,8));
  });
}
event.preventDefault();
  })
  document.querySelector("#filter").addEventListener("click",function(event){
    console.log(event.target.innerHTML)
    let target=event.target.innerHTML;
      const fetchFilterPromise = fetch("https://restcountries.eu/rest/v2/region/"+target);
      fetchFilterPromise.then(response => {
        return response.json();
      }).then(countries => {
        main.innerHTML="";
        main.insertAdjacentHTML("afterbegin",displayCountries(countries,8));
      });
    
   // event.preventDefault();
      })

function displayCountries(countries,count) {
  
document.querySelector(".loader").style.display="block";  
  const names = countries.slice(0,count).map(country => `<div class="container-country wrapper" data-attr="${country.name}">
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
document.querySelector(".loader").style.display="none";  
  return `${names}`

}
function displaySingleCountry(singleCountry) {
  
  document.querySelector(".loader").style.display="block";  
    const name = singleCountry.map(country => `
    <div class="container-countries-single container-countries-single--flag"><img
            src="${country.flag}" alt="">
    </div>
    <div class="container-countries-single container-countries-single--info">
        <h2>${country.name}</h2>
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
            <li class="wrapper">${borderList(country.borders)}</li>
            <!-- <li class="wrapper">Germany</li>
            <li class="wrapper">Netherlands</li>-->
        </ul>
    </div>
`).join("\n");
  document.querySelector(".loader").style.display="none";  
    return `${name}`
  
  }
  function borderList(item){
    
    return item.toString().replace(/,/g,"</li><li class='wrapper'>");
    //return p;
  }
function formatNumber(num){
    return num.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1,');
}
document.querySelector("section.container-countries").addEventListener("click",function(event){
  console.log(event.target.closest(".container-country").getAttribute("data-attr"))
  
let target=event.target.closest(".container-country").getAttribute("data-attr");
 // alert("hey");
  const fetchFilterPromise = fetch(`https://restcountries.eu/rest/v2/name/${target}?fullText=true`);
    fetchFilterPromise.then(response => {
      return response.json();
    }).then(countries => {
      main.innerHTML="";
      main.insertAdjacentHTML("afterbegin",displaySingleCountry(countries));
    });
  event.preventDefault();
    })
window.addEventListener("DOMContentLoaded",function(){
   // document.querySelector(".loader").style.display="none";  
})
