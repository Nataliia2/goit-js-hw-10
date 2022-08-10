import '../css/styles.css';
import debounce from 'lodash.debounce';
import Notiflix from 'notiflix';
import apiCountries from './fetchCountries';


const DEBOUNCE_DELAY = 300;

const searchContry = document.querySelector('#search-box');
const countryList = document.querySelector('.country-list')
const coutryInfo = document.querySelector('.country-info');

searchContry.addEventListener('input', debounce(onSearchContry, DEBOUNCE_DELAY))


function onSearchContry(e) {
    const countries = e.target.value.trim();
    if (countries === '') { 
        removeData();
        return;
    }
    apiCountries(countries)
        .then(data => insertContent(data))
        .catch(error => {
            if (error.code === 404) {
                notFound();
            } else {
                Notiflix.Notify.failure('Unknow error');
            }
            removeData();
    });
}


const insertContent = (countries) => {
    
    removeData();
    
     if (countries.length === 1) {
        
        const resultInfo = countryInfoMarkup(countries);
        coutryInfo.insertAdjacentHTML('beforeend', resultInfo);

    } else if (countries.length < 10 && countries.length > 1) {
        const result = listCountry(countries);
        countryList.innerHTML = result; 
        
    } else if (countries.length > 10) {
        Notiflix.Notify.info('Too many matches found. Please enter a more specific name.');
        
    } else {
        notFound();
    }
}

const listCountry = (list) => list.reduce((acc, item) => acc + countryMarkup(item), '');


const countryMarkup = (({ name, flags }) => {
    return `<li class="country-item">
    <img src='${flags.svg}' alt='flag ${name}' width='60' height='40'>${name}</li>`
});

const countryInfoMarkup = (country) => {
    const { flags, name, capital, population, languages } = country[0];
        const language = languages.map(list => list.name).join(' ');
        const info = `<h2 class="country-name"><img class="country-flag"src='${flags.svg}' alt='Country flag' width='40'>${name}</h2>
        <p class="country-info__text"><span>Capital:</span>${capital}</p>
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



