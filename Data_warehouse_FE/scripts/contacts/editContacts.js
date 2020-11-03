import { apiRequest } from '../services.js';
import { getContacts } from './getAndDeleteContacts.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

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

updateButton.addEventListener('click', updateContact);
interestRange.addEventListener('mousemove', updateSelect)
interestSelect.addEventListener('change', updateRange)

$('#edit-contact').on('hide.bs.modal', () => { document.getElementById("edit-contact-form").reset() });

async function editContact(e) {
    contactID = e.currentTarget.getAttribute('data-id');
    const contactCurrentData = await getContactData(contactID);
    if (contactCurrentData instanceof Error) {
        console.log(contactCurrentData);
    }
    console.log(contactCurrentData);
    fillModal(contactCurrentData);
}


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


function fillModal(contactCurrentData) {
    name.value = contactCurrentData.name;
    lastname.value = contactCurrentData.lastname;
    position.value = contactCurrentData.position;
    email.value = contactCurrentData.email;
    company.value = contactCurrentData.company;
    region.value = contactCurrentData.region;
    country.value = contactCurrentData.country;
    city.value = contactCurrentData.city;
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

function updateContact() {
    const newContactData = {
        "name": name.value,
        "address": address.value,
        "email": email.value,
        "telephone": telephone.value,
        "city": city.value
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

function updateSelect() {
    const newValue = interestRange.value;
    interestSelect.value = newValue;
}

function updateRange() {
    const newValue = interestSelect.value;
    interestRange.value = newValue;

}

// //Methods to fill city select options in edit modal


// /**
//  * @method getCities
//  * @description Method to get cities from API
//  */
// async function getCities() {
//     const requestInfo = {
//         headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
//     }
//     const citiesList = apiRequest(`${BASE_URL}cities`, requestInfo);
//     citiesList.then((response) => {
//         city.innerHTML = "<option selected>Seleccionar ciudad</option>";
//         fillCities(response);
//     }).catch((error) => { console.log(error) });
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
//         return citiiesMarkUp(id, name);
//     });
//     city.innerHTML += cityHTML.join("\n");
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

// getCities();




export {
    editContact
};