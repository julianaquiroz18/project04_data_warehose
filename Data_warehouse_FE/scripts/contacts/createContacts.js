import { apiRequest } from '../services.js';
import { getContacts } from './getAndDeleteContacts.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

/**
 * Global Variables
 */
const createButton = document.querySelector(".create");
const selectCompany = document.querySelector("#company");
const selectRegion = document.querySelector("#region");
const selectCountry = document.querySelector("#country");
const selectCity = document.querySelector("#city");
const interestRange = document.querySelector('.interest-range');
const interestSelect = document.getElementById('interest-select');
/**
 * Events
 */
createButton.addEventListener('click', createContact);
selectCompany.addEventListener('click', getCompanies);
selectRegion.addEventListener('click', getRegions);
selectRegion.addEventListener('change', getCountries);
selectCountry.addEventListener('change', getCities);
selectCity.addEventListener('change', enableAddress);
interestRange.addEventListener('mousemove', updateSelect)
interestSelect.addEventListener('change', updateRange)
$('#new-contact').on('hide.bs.modal', () => { document.getElementById("new-contact-form").reset() });
$('#new-contact').on('hide.bs.modal', disable);


/**
 * @method getCompanies
 * @description Method to get Companies from API
 */
function getCompanies() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const companiesList = apiRequest(`${BASE_URL}companies`, requestInfo);
    companiesList.then((response) => {
        selectCompany.innerHTML = `<option selected disabled value="0">Seleccionar compañía</option>`;
        fillOptions(response, selectCompany);
    }).catch((error) => { console.log(error) });
}

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
        selectRegion.innerHTML = `<option selected disabled value="0">Seleccionar región</option>`;
        fillOptions(response, selectRegion);
    }).catch((error) => { console.log(error) });
}

/**
 * @method getCountries
 * @description Method to get countries for a specific region from API
 */
function getCountries() {
    document.getElementById('country').disabled = false;
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const countryList = apiRequest(`${BASE_URL}countries/${selectRegion.value}`, requestInfo);
    countryList.then((response) => {
        selectCountry.innerHTML = `<option selected disabled value="0">Seleccionar país</option>`;
        fillOptions(response.countries, selectCountry);
    }).catch((error) => { console.log(error) });
}

/**
 * @method getCities
 * @description Method to get cities for a specific country from API
 */
function getCities() {
    document.getElementById('city').disabled = false;
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const citiesList = apiRequest(`${BASE_URL}cities/${selectCountry.value}`, requestInfo);
    citiesList.then((response) => {
        selectCity.innerHTML = `<option selected disabled value="0">Seleccionar ciudad</option>`;
        fillOptions(response.cities, selectCity);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillOptions
 * @description Get regions data and fill select options
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
 * @method enableAddress
 * @description Method to enable address input 
 */
function enableAddress() {
    document.getElementById('address').disabled = false;
}


/**
 * @method createContact
 * @description Method to create company 
 */
function createContact() {
    const contactData = getContactData();
    const requestInfo = {
        method: 'POST',
        body: JSON.stringify(contactData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    }
    const login = apiRequest(`${BASE_URL}contacts`, requestInfo);
    login.then(json => {
        swal("", `Contacto ${json.name} ${json.lastname} fue creado exitosamente`, "success");
        getContacts();
    }).catch((error) => { console.log(error) });
}

/**
 * @method getContactData
 * @description Method to get current contact information
 * @return {object} contactData
 */
function getContactData() {
    const contactData = {
        'name': document.querySelector("#name").value,
        'lastname': document.querySelector("#lastname").value,
        'position': document.querySelector("#position").value,
        'email': document.querySelector("#email").value,
        'company': document.querySelector("#company").value,
        'city': document.querySelector("#city").value,
        'address': document.querySelector("#address").value,
        'interest': Number(document.querySelector("#interest-select").value),
        'contactChannel': [{
                'contactChannel': document.querySelector("#contact-channel-1").value,
                'userAcount': document.querySelector("#userAcount-1").value,
                'preferences': document.querySelector("#preferences-1").value
            },
            {
                'contactChannel': document.querySelector("#contact-channel-2").value,
                'userAcount': document.querySelector("#userAcount-2").value,
                'preferences': document.querySelector("#preferences-2").value
            },
            {
                'contactChannel': document.querySelector("#contact-channel-3").value,
                'userAcount': document.querySelector("#userAcount-3").value,
                'preferences': document.querySelector("#preferences-3").value
            },
            {
                'contactChannel': document.querySelector("#contact-channel-4").value,
                'userAcount': document.querySelector("#userAcount-4").value,
                'preferences': document.querySelector("#preferences-4").value
            }
        ]
    };
    return contactData;
}

/**
 * @method updateSelect
 * @description Update interest select value
 */
function updateSelect() {
    const newValue = interestRange.value;
    interestSelect.value = newValue;
}

/**
 * @method updateSelect
 * @description Update interest bar range value
 */
function updateRange() {
    const newValue = interestSelect.value;
    interestRange.value = newValue;
}

/**
 * @method disable
 * @description Disable country, city and address input after close create-modal
 */
function disable() {
    selectCountry.disabled = true;
    selectCity.disabled = true;
    document.getElementById('address').disabled = true;
}