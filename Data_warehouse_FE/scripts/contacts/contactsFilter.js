import { apiRequest } from '../services.js';
import { fillContactsInfo } from './getAndDeleteContacts.js'
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

/**
 * Global Variables
 */
const city = document.querySelector('#city-filter');
const company = document.querySelector('#company-filter');
const btnSearch = document.querySelector('.btn-search');
const filterForm = document.getElementById("filter-form");
const divFilterForm = document.querySelector(".input-group-append");

/**
 * Events
 */
company.addEventListener('click', fillCompanies);
city.addEventListener('click', fillCities);
btnSearch.addEventListener('click', filterContacts);
filterForm.addEventListener('keyup', listenInputKeyEvent);
divFilterForm.addEventListener('keyup', listenInputKeyEvent);

$('.input-group-append').on('hide.bs.dropdown', function(event) {
    return !document.querySelector('.input-group-append').contains(event.clickEvent.target);
});

$('.input-group-append').on('show.bs.dropdown', () => { filterForm.reset() });


/**
 * @method fillCompanies
 * @description Method to fill company select options
 */
function fillCompanies() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const companiesList = apiRequest(`${BASE_URL}companies`, requestInfo);
    companiesList.then((response) => {
        company.innerHTML = `<option value="null">Todas</option>`;
        fillOptions(response, company);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillCities
 * @description Method to fill c select options in edit modal
 */
function fillCities() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const citiesList = apiRequest(`${BASE_URL}cities`, requestInfo);
    citiesList.then((response) => {
        city.innerHTML = `<option value="null">Todos</option>`;
        fillOptions(response, city);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillOptions
 * @description Fill select options
 * @param {array} infoList
 */
function fillOptions(infoList, node) {
    const nodeHTML = infoList.map(region => {
        const id = region._id;
        const name = region.name;
        return optionssMarkUp(id, name);
    });
    node.innerHTML += nodeHTML.join("\n");
}

/**
 * @method optionssMarkUp
 * @description Options marking method
 * @param {string} id
 * @param {string} name
 * @return {string}
 */
function optionssMarkUp(id, name) {
    return (
        `<option value="${id}">${name}</option>`
    );
}


/**
 * @method filterContacts
 * @description Method to filter contacts
 */
function filterContacts() {
    const filterData = {
        "name": document.querySelector("#name-filter").value,
        "position": document.querySelector("#position-filter").value,
        "city": city.value,
        "company": company.value,
        "favoriteChannel": document.querySelector("#favorite-channel").value,
        "interest": document.querySelector("#interes-filter").value
    }
    const requestInfo = {
        method: 'POST',
        body: JSON.stringify(filterData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    }
    const login = apiRequest(`${BASE_URL}contacts-filter`, requestInfo);
    login.then(json => {
        document.querySelector(".contacts-body-table").innerHTML = "";
        fillContactsInfo(json)
    }).catch((error) => { console.log(error) });
}


/**
 * @method listenInputKeyEvent
 * @description Method to handle API request acording to input value 
 * and previous request status
 * @param {object} e event information 
 */
function listenInputKeyEvent(e) {
    const isEnterKey = e.keyCode === 13;
    if (isEnterKey === true) {
        filterContacts();
    };
};