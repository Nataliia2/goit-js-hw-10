import './css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';


const DEBOUNCE_DELAY = 300;

const searchContry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list')
const coutryInfo = document.querySelector('.country-info');

searchContry.addEventListener('input', debounce(onSearchContry, DEBOUNCE_DELAY))

const URL = "https://restcountries.com/v2";
 
function fetchCountries(name) {

    return fetch(`${URL}/name/${name}?fields=name,capital,population,flags,languages`)
.then((response) => response.json())
.catch((error) => {
    console.log("error", error);
})
}

function onSearchContry(e) {
    const countrys = e.target.value.trim();
    if (countrys === '') {
        removeData();
        return;
    }
    fetchCountries(countrys)
    .then(data => insertContent(data))
    .catch(error => notFound(error));
};


const insertContent = (countries) => {
    const result = listCountry(countries);
    
     if (countries.length === 1) {
        countryList.innerHTML = result; 
        const resultInfo = countryInfoMarkup(countries);
        coutryInfo.insertAdjacentHTML('beforeend', resultInfo);
    } else if (countries.length < 10 && countries.length > 1) {
        countryList.innerHTML = result; 
        coutryInfo.innerHTML = '';
    } else {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        removeData();
    }
}

const listCountry = (list) => list.reduce((acc, item) => acc + countryMarkup(item), '');


const countryMarkup = (({ name, flags }) => {
    return `<li class="country-item">
    <img src='${flags.svg}' alt='flag ${name}' width='60' height='40'>${name}</li>`
});

const countryInfoMarkup = (country) => {
    const { capital, population, languages } = country[0];
        const language = languages.map(list => list.name).join(' ');
        const info = `<p class="country-info__text"><span>Capital:</span>${capital}</p>
        <p class="country-info__text"><span>Population:</span>${population}</p>
        <p class="country-info__text"><span>Languages:</span>${language}</p>`;
        return info;
};

const notFound = () => {
    Notiflix.Notify.failure('Oops, there is no country with that name')
    removeData();
};


const removeData = () => {
    countryList.innerHTML = '';
    coutryInfo.innerHTML = '';
}



