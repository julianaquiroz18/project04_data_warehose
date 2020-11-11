import { apiRequest } from '../services.js';
import { getCompanies } from './getAndDeleteCompanies.js';
const BASE_URL = "/data_wharehose/v1/";

/**
 * Global Variables
 */
const updateButton = document.querySelector(".update-button");
let name = document.querySelector("#edit-name");
let address = document.querySelector("#edit-address");
let email = document.querySelector("#edit-email");
let telephone = document.querySelector("#edit-telephone");
let city = document.querySelector("#edit-city");
let companyID;

/**
 * Events
 */
updateButton.addEventListener('click', updateCompany);
$('#edit-company').on('hide.bs.modal', () => { document.getElementById("edit-company-form").reset() });


/**
 * @method editCompany
 * @description Edit company information method
 * @param {object} e event information
 */
async function editCompany(e) {
    companyID = e.currentTarget.getAttribute('data-id');
    const companyCurrentData = await getCompanyData(companyID);
    if (companyCurrentData instanceof Error) {
        console.log(companyCurrentData);
    }
    fillModal(companyCurrentData);
}

/**
 * @method getCompanyData
 * @description Get current company Information
 * @param {string} companyID
 * @return {object} companyCurrentData
 */
async function getCompanyData(companyID) {
    try {
        const requestInfo = {
            headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
        };
        const companyCurrentData = await apiRequest(`${BASE_URL}companies/${companyID}`, requestInfo);
        return companyCurrentData;
    } catch (error) {
        return error;
    }
}

/**
 * @method fillModal
 * @description Fill edit-modal with company current information
 * @param {object} companyCurrentData
 */
function fillModal(companyCurrentData) {
    name.value = companyCurrentData.name;
    address.value = companyCurrentData.address;
    email.value = companyCurrentData.email;
    telephone.value = companyCurrentData.telephone;
    city.value = companyCurrentData.city;
}

/**
 * @method updateCompany
 * @description Update company information
 */
function updateCompany() {
    const newCompanyData = {
        "name": name.value,
        "address": address.value,
        "email": email.value,
        "telephone": telephone.value,
        "city": city.value
    };

    const requestInfo = {
        method: 'PUT',
        body: JSON.stringify(newCompanyData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    };
    const login = apiRequest(`${BASE_URL}companies/${companyID}`, requestInfo);
    login.then(json => {
        swal("", json.message, "success");
        getCompanies();
    }).catch((error) => { console.log(error) });

}


//Methods to fill city select options in edit modal


/**
 * @method getCities
 * @description Method to get cities from API
 */
async function getCities() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const citiesList = apiRequest(`${BASE_URL}cities`, requestInfo);
    citiesList.then((response) => {
        city.innerHTML = "<option disabled selected>Seleccionar ciudad</option>";
        fillCities(response);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillCities
 * @description Get city data and create rows
 * @param {array} citiesList
 */
function fillCities(citiesList) {
    const cityHTML = citiesList.map(city => {
        const id = city._id;
        const name = city.name;
        return citiiesMarkUp(id, name);
    });
    city.innerHTML += cityHTML.join("\n");
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

getCities();




export {
    editCompany
};