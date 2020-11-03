import { apiRequest } from '../services.js';
import { getContacts } from './getAndDeleteContacts.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

/**
 * Global Variables
 */
const updateButton = document.querySelector(".update-button");
let name = document.querySelector("#edit-name");
let lastname = document.querySelector("#edit-lastname");
let position = document.querySelector("#edit-position");
let email = document.querySelector("#edit-email");
let company = document.querySelector("#edit-company");
let region = document.querySelector("#edit-region");
let country = document.querySelector("#edit-country");
let city = document.querySelector("#edit-city");
let address = document.querySelector("#edit-address");
let interestSelect = document.querySelector("#edit-interest-select");
let interestRange = document.querySelector("#edit-interest-rage");
let contactChannel1 = document.querySelector("#edit-contact-channel-1");
let userAcount1 = document.querySelector("#edit-userAcount-1");
let preferences1 = document.querySelector("#edit-preferences-1");
let contactChannel2 = document.querySelector("#edit-contact-channel-2");
let userAcount2 = document.querySelector("#edit-userAcount-2");
let preferences2 = document.querySelector("#edit-preferences-2");
let contactChannel3 = document.querySelector("#edit-contact-channel-3");
let userAcount3 = document.querySelector("#edit-userAcount-3");
let preferences3 = document.querySelector("#edit-preferences-3");
let contactChannel4 = document.querySelector("#edit-contact-channel-4");
let userAcount4 = document.querySelector("#edit-userAcount-4");
let preferences4 = document.querySelector("#edit-preferences-4");
let contactID;

/**
 * Events
 */
updateButton.addEventListener('click', updateContact);
interestRange.addEventListener('mousemove', updateSelect);
interestSelect.addEventListener('change', updateRange);
region.addEventListener('change', getCountries);
country.addEventListener('change', getCities);
city.addEventListener('change', enableAddress);
$('#edit-contact').on('hide.bs.modal', () => { document.getElementById("edit-contact-form").reset() });
$('#edit-contact').on('hide.bs.modal', resetEditModalConfig);


/**
 * @method editContact
 * @description Method to edit contact information
 * @param {object} e Event information
 */
async function editContact(e) {
    contactID = e.currentTarget.getAttribute('data-id');
    const contactCurrentData = await getContactData(contactID);
    if (contactCurrentData instanceof Error) {
        console.log(contactCurrentData);
    }
    fillModal(contactCurrentData);
}

/**
 * @method getContactData
 * @description Method to get current contact information
 * @param {string} contactID
 * @return {object} contactCurrentData
 */
async function getContactData(contactID) {
    try {
        const requestInfo = {
            headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
        };
        const contactCurrentData = await apiRequest(`${BASE_URL}contacts/${contactID}`, requestInfo);
        return contactCurrentData;
    } catch (error) {
        return error;
    }
}

/**
 * @method fillModal
 * @description Method to fill edit-modal with current contact information
 * @param {object} contactCurrentData
 */
function fillModal(contactCurrentData) {
    name.value = contactCurrentData.name;
    lastname.value = contactCurrentData.lastname;
    position.value = contactCurrentData.position;
    email.value = contactCurrentData.email;
    company.value = contactCurrentData.company;
    region.value = contactCurrentData.city.country.region._id;
    country.value = contactCurrentData.city.country._id;
    city.value = contactCurrentData.city._id;
    address.value = contactCurrentData.address;
    interestSelect.value = contactCurrentData.interest;
    interestRange.value = contactCurrentData.interest;
    contactChannel1.value = contactCurrentData.contactChannel[0].contactChannel;
    userAcount1.value = contactCurrentData.contactChannel[0].userAcount;
    preferences1.value = contactCurrentData.contactChannel[0].preferences;
    contactChannel2.value = contactCurrentData.contactChannel[1].contactChannel;
    userAcount2.value = contactCurrentData.contactChannel[1].userAcount;
    preferences2.value = contactCurrentData.contactChannel[1].preferences;
    contactChannel3.value = contactCurrentData.contactChannel[2].contactChannel;
    userAcount3.value = contactCurrentData.contactChannel[2].userAcount;
    preferences3.value = contactCurrentData.contactChannel[2].preferences;
    contactChannel4.value = contactCurrentData.contactChannel[3].contactChannel;
    userAcount4.value = contactCurrentData.contactChannel[3].userAcount;
    preferences4.value = contactCurrentData.contactChannel[3].preferences;
}

/**
 * @method updateContact
 * @description Update contact information
 */
function updateContact() {
    const newContactData = {
        "name": name.value,
        "lastname": lastname.value,
        "position": position.value,
        "email": email.value,
        "company": company.value,
        "city": city.value,
        'address': address.value,
        'interest': Number(interestSelect.value),
        'contactChannel': [{
                'contactChannel': contactChannel1.value,
                'userAcount': userAcount1.value,
                'preferences': preferences1.value
            },
            {
                'contactChannel': contactChannel2.value,
                'userAcount': userAcount2.value,
                'preferences': preferences2.value
            },
            {
                'contactChannel': contactChannel3.value,
                'userAcount': userAcount3.value,
                'preferences': preferences3.value
            },
            {
                'contactChannel': contactChannel4.value,
                'userAcount': userAcount4.value,
                'preferences': preferences4.value
            }
        ]
    };

    const requestInfo = {
        method: 'PUT',
        body: JSON.stringify(newContactData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    };
    const login = apiRequest(`${BASE_URL}contacts/${contactID}`, requestInfo);
    login.then(json => {
        console.log(json);
        getContacts();
    }).catch((error) => { console.log(error) });

}

/**
 * @method updateSelect
 * @description Update interest select input value
 */
function updateSelect() {
    const newValue = interestRange.value;
    interestSelect.value = newValue;
}

/**
 * @method updateRange
 * @description Update interest range input value
 */
function updateRange() {
    const newValue = interestSelect.value;
    interestRange.value = newValue;

}

//Methods to active fields if any change

/**
 * @method getCountries
 * @description Method to get countries for a specific region from API and active country input
 */
function getCountries() {
    country.disabled = false;
    country.value = null;
    city.value = null;
    address.value = null;
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const countryList = apiRequest(`${BASE_URL}countries/${region.value}`, requestInfo);
    countryList.then((response) => {
        console.log(response);
        country.innerHTML = "<option selected>Seleccionar país</option>";
        fillOptions(response.countries, country);
    }).catch((error) => { console.log(error) });
}

/**
 * @method getCities
 * @description Method to get cities for a specific country from API and active city input
 */
function getCities() {
    city.disabled = false;
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const citiesList = apiRequest(`${BASE_URL}cities/${country.value}`, requestInfo);
    citiesList.then((response) => {
        console.log(response);
        city.innerHTML = "<option selected>Seleccionar ciudad</option>";
        fillOptions(response.cities, city);
    }).catch((error) => { console.log(error) });
}

/**
 * @method enableAddress
 * @description Enable address input
 */
function enableAddress() {
    address.disabled = false;
}


// //Methods to fill select options in edit modal with current contact information

/**
 * @method fillCompanies
 * @description Method to fill company select options in edit modal
 */
function fillCompanies() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const companiesList = apiRequest(`${BASE_URL}companies`, requestInfo);
    companiesList.then((response) => {
        console.log(response);
        company.innerHTML = "<option selected>Seleccionar compañía</option>";
        fillOptions(response, company);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillRegions
 * @description Method to fill region select options in edit modal
 */
function fillRegions() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const regionsList = apiRequest(`${BASE_URL}regions`, requestInfo);
    regionsList.then((response) => {
        console.log(response);
        region.innerHTML = "<option selected>Seleccionar región</option>";
        fillOptions(response, region);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillCountries
 * @description Method to fill countries select options in edit modal
 */
function fillCountries() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const countryList = apiRequest(`${BASE_URL}countries`, requestInfo);
    countryList.then((response) => {
        console.log(response);
        country.innerHTML = "<option selected>Seleccionar país</option>";
        fillOptions(response, country);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillCities
 * @description Method to fill cities select options in edit modal
 */
async function fillCities() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const citiesList = apiRequest(`${BASE_URL}cities`, requestInfo);
    citiesList.then((response) => {
        city.innerHTML = "<option selected>Seleccionar ciudad</option>";
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
 * @method resetEditModalConfig
 * @description Disable country, city and address inputs and fill options after edid-modal is closed
 */
function resetEditModalConfig() {
    fillCompanies()
    fillRegions()
    fillCountries()
    fillCities()
    country.disabled = true;
    city.disabled = true;
    address.disabled = true;
}

resetEditModalConfig()

export {
    editContact
};