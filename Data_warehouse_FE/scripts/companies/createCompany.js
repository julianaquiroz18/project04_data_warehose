import { apiRequest } from '../services.js';
import { getCompanies } from './getAndDeleteCompanies.js';
const BASE_URL = "/data_wharehose/v1/";

/**
 * Global Variables
 */
const createButton = document.querySelector(".create");
const selectCity = document.querySelector("#city");

/**
 * Events
 */
createButton.addEventListener('click', createCompany);
selectCity.addEventListener('click', getCities);
$('#new-company').on('hide.bs.modal', () => { document.getElementById("new-company-form").reset() });

/**
 * @method getCities
 * @description Method to get cities from API
 */
function getCities() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const citiesList = apiRequest(`${BASE_URL}cities`, requestInfo);
    citiesList.then((response) => {
        selectCity.innerHTML = `<option disabled selected value="0">Seleccionar ciudad</option>`;
        fillCities(response);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillCities
 * @description Get city data and create rows
 * @param {array} companiesList
 */
function fillCities(companiesList) {
    const cityHTML = companiesList.map(city => {
        const id = city._id;
        const name = city.name;
        return citiiesMarkUp(id, name);
    });
    selectCity.innerHTML += cityHTML.join("\n");
}

/**
 * @method citiiesMarkUp
 * @description Cities marking method
 * @param {string} id
 * @param {string} name
 * @return {string}
 */
function citiiesMarkUp(id, name) {
    return (
        `<option value="${id}">${name}</option>`
    );
}


/**
 * @method createCompany
 * @description Method to create company 
 */
function createCompany() {
    const companyData = {
        "name": document.querySelector("#name").value,
        "address": document.querySelector("#address").value,
        "email": document.querySelector("#email").value,
        "telephone": document.querySelector("#telephone").value,
        "city": selectCity.value,
    }
    const requestInfo = {
        method: 'POST',
        body: JSON.stringify(companyData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    }
    const login = apiRequest(`${BASE_URL}companies`, requestInfo);
    login.then(json => {
        swal("", `Compañía ${json.name} fue creada exitosamente`, "success");
        getCompanies();
    }).catch((error) => { console.log(error) });
}