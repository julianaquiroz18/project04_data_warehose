import { apiRequest } from '../services.js';
import { getContacts } from './getContacts.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

const createButton = document.querySelector(".create");
const selectRegion = document.querySelector("#region");
const selectCountry = document.querySelector("#country");
const selectCity = document.querySelector("#city");

//createButton.addEventListener('click', createCompany);
selectRegion.addEventListener('click', getRegions);
selectRegion.addEventListener('change', getCountries);
//selectCountry.addEventListener('click', getCountries);
//selectCity.addEventListener('click', getCities);


/**
 * @method getRegions
 * @description Method to get regions from API
 */
function getRegions() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const regionsList = apiRequest(`${BASE_URL}regions`, requestInfo);
    regionsList.then((response) => {
        console.log(response);
        selectRegion.innerHTML = "<option selected>Seleccionar región</option>";
        fillRegions(response);
    }).catch
}

/**
 * @method fillRegions
 * @description Get regions data and fill select options
 * @param {array} regionsList
 */
function fillRegions(regionsList) {
    const regionHTML = regionsList.map(region => {
        const id = region._id;
        const name = region.name;
        return regionssMarkUp(id, name);
    });
    selectRegion.innerHTML += regionHTML.join("\n");
}

/**
 * @method regionssMarkUp
 * @description Regions marking method
 * @param {string} id
 * @param {string} name
 * @return {string}
 */
function regionssMarkUp(id, name) {
    return (
        `<option value="${id}">${name}</option>`
    );
}


function getCountries() {
    console.log(selectRegion.value)
}







// /**
//  * @method getCities
//  * @description Method to get cities from API
//  */
// function getCities() {
//     const requestInfo = {
//         headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
//     }
//     const citiesList = apiRequest(`${BASE_URL}cities`, requestInfo);
//     citiesList.then((response) => {
//         console.log(response);
//         fillCities(response);
//     }).catch
// }

// /**
//  * @method fillCities
//  * @description Get city data and create rows
//  * @param {array} companiesList
//  */
// function fillCities(companiesList) {
//     const cityHTML = companiesList.map(city => {
//         const id = city._id;
//         const name = city.name;
//         return citiiesMarkUp(id, name, address, email, telephone, city);
//     });
//     selectCity.innerHTML += cityHTML.join("\n");
// }

// /**
//  * @method citiiesMarkUp
//  * @description Cities marking method
//  * @param {string} id
//  * @param {string} name
//  * @return {string}
//  */
// function citiiesMarkUp(id, name) {
//     return (
//         `<option value="${id}">${name}</option>`
//     );
// }


// /**
//  * @method createCompany
//  * @description Method to create company 
//  */
// function createCompany() {
//     const companyData = {
//         "name": document.querySelector("#name").value,
//         "address": document.querySelector("#address").value,
//         "email": document.querySelector("#email").value,
//         "telephone": document.querySelector("#telephone").value,
//         "city": selectCity.value,
//     }
//     const requestInfo = {
//         method: 'POST',
//         body: JSON.stringify(companyData),
//         headers: {
//             'Content-Type': 'application/json',
//             'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
//         }
//     }
//     const login = apiRequest(`${BASE_URL}companies`, requestInfo);
//     login.then(json => {
//         console.log(`Compania ${json.name} fue creada exitosamente`)
//         getCompanies();
//     }).catch((error) => { console.log(error) });
// }