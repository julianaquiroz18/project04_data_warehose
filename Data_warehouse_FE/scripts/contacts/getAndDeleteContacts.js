import { apiRequest } from '../services.js';
import { editContact } from '../contacts/editContacts.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

/**
 * Global Variables
 */
const contactsBodyTable = document.querySelector(".contacts-body-table");
const contactsSelected = document.querySelector(".contacts-selected");
const deleteContactsButton = document.querySelector(".delete-contacts");
const deleteButtonConfirmation = document.querySelector(".delete");
const mainCheckbox = document.querySelector(".all-checkbox");
let contactsIDArray = [];

/**
 * Events
 */
mainCheckbox.addEventListener('click', selectAllContacts);
deleteButtonConfirmation.addEventListener('click', deleteContacts)

/**
 * @method getContacts
 * @description Method to get contacts from API
 */
function getContacts() {
    contactsBodyTable.innerHTML = "";
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const contactsList = apiRequest(`${BASE_URL}contacts`, requestInfo);
    contactsList.then((response) => {
        console.log(response);
        fillContactsInfo(response);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillContactsInfo
 * @description Get contact data and create rows
 * @param {array} contactsList
 */
function fillContactsInfo(contactsList) {
    const contactHTML = contactsList.map(contact => {
        const id = contact._id;
        const name = contact.name;
        const lastname = contact.lastname;
        const email = contact.email;
        const country = contact.city.country.name;
        const region = contact.city.country.region.name;
        const company = contact.company.name;
        const position = contact.position;
        const interest = contact.interest;
        const interestColor = getColor(interest);
        return contactsMarkUp(id, name, lastname, email, country, region, company, position, interest, interestColor);
    });
    contactsBodyTable.innerHTML += contactHTML.join("\n");
    contactsBodyTable.querySelectorAll('.contact-row').forEach((row) => row.addEventListener('mouseenter', showOrHideContactOptions));
    contactsBodyTable.querySelectorAll('.contact-row').forEach((row) => row.addEventListener('mouseleave', showOrHideContactOptions));
    contactsBodyTable.querySelectorAll('.delete').forEach((button) => button.addEventListener('click', deleteOneContact));
    contactsBodyTable.querySelectorAll('.edit').forEach((button) => button.addEventListener('click', editContact));
    contactsBodyTable.querySelectorAll('.contact-checkbox').forEach((checkbox) => checkbox.addEventListener('click', selectContactRow));
}


/**
 * @method getColor
 * @description Get class to include color in interest bar
 * @param {number} interest
 * @return {string}
 */
const getColor = interest => {
    switch (interest) {
        case 0:
            return ""
        case 25:
            return "bg-info";
        case 50:
            return "bg-dark";
        case 75:
            return "bg-warning";
        case 100:
            return "bg-danger";
        default:
            break;
    }
}


/**
 * @method contactsMarkUp
 * @description Rows marking method
 * @param {string} id
 * @param {string} name
 * @param {string} lastname
 * @param {string} email
 * @param {string} country
 * @param {string} region
 * @param {string} company
 * @param {string} position
 * @param {number} interest
 * @return {string}
 */
function contactsMarkUp(id, name, lastname, email, country, region, company, position, interest, interestColor) {
    return (
        `<tr class="contact-row">
        <td class="align-middle"><input class="ml-3 contact-checkbox" type="checkbox" name="user-info" data-id="${id}"></td>
        <td class="align-middle">
            <div class="d-flex flex-row align-items-center">
                <img src="https://i.picsum.photos/id/1027/2848/4272.jpg?hmac=EAR-f6uEqI1iZJjB6-NzoZTnmaX0oI0th3z8Y78UpKM" alt="user pic" class="user-img rounded-circle">
                <div class="ml-2">
                    <p>${name} ${lastname}</p>
                    <p class="email-table text-black-50">${email}</p>
                </div>
            </div>

        </td>
        <td class="align-middle">
            <p>${country}</p>
            <p class="region-table text-black-50">${region}</p>
        </td>
        <td class="align-middle">${company}</td>
        <td class="align-middle">${position}</td>
        <td class="align-middle">
            <div class="div-interest d-inline-flex align-items-center">
                <p class="interest-percentage">${interest}%</p>
                <div class="progress ml-3">
                    <div class="progress-bar w-${interest} ${interestColor}" role="progressbar" aria-valuenow="${interest}" aria-valuemin="0" aria-valuemax="100"></div>
                </div>
            </div>
        </td>
        <td class="align-middle text-center">
            <button type="button" class="btn text-black-50 ellipsis"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></button>
            <button type="button" class="btn btn-lg text-black-50 d-none delete" data-id="${id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
            <button type="button" class="btn btn-lg text-black-50 d-none edit" data-id="${id}" data-toggle="modal" data-target="#edit-contact"><i class="fa fa-pencil" aria-hidden="true"></i></button>
        </td>
    </tr>`
    );
}

/**
 * @method showOrHideContactOptions
 * @description Change UI method to show edit and delete buttons when contact hover
 * @param {object} e Event Information
 */
function showOrHideContactOptions(e) {
    e.currentTarget.querySelector('.ellipsis').classList.toggle('d-none');
    e.currentTarget.querySelector('.delete').classList.toggle('d-none');
    e.currentTarget.querySelector('.edit').classList.toggle('d-none');
}

/**
 * @method selectContactRow
 * @description Change UI when select conntact and storage Contact selected IDs in array
 * @param {object} e Event Information
 */
function selectContactRow(e) {
    updateIDsArray(e.currentTarget);
    updateContactsUI();
    e.currentTarget.parentNode.parentNode.classList.toggle('selected-row');
}

/**
 * @method selectAllContacts
 * @description Change UI when main checkbox is selected (select all conntacts) and storage Contacts selected IDs in array
 * @param {object} e Event Information
 */
function selectAllContacts(e) {
    const checkboxes = document.getElementsByClassName('contact-checkbox');
    for (let i = 0, n = checkboxes.length; i < n; i++) {
        checkboxes[i].checked = e.currentTarget.checked;
        updateIDsArray(checkboxes[i]);
        updateContactsUI();
        if (e.currentTarget.checked) {
            checkboxes[i].parentNode.parentNode.classList.add('selected-row');
        } else {
            checkboxes[i].parentNode.parentNode.classList.remove('selected-row');
        }
    }

}

/**
 * @method updateIDsArray
 * @description Method to update array with contacts selected IDs
 * @param {object} e Event Information
 */
function updateIDsArray(checkbox) {
    const contactID = checkbox.getAttribute('data-id');
    const alreadyInArray = contactsIDArray.includes(contactID);
    if (checkbox.checked && !alreadyInArray) {
        contactsIDArray.push(contactID);
    }
    if (!checkbox.checked) {
        mainCheckbox.checked = false;
        const index = contactsIDArray.indexOf(contactID)
        contactsIDArray.splice(index, 1);
    }
}

/**
 * @method updateContactsUI
 * @description Method to update UI showing delete button and number of contacts selected
 */
function updateContactsUI() {
    const arrayLength = contactsIDArray.length;
    if (arrayLength === 0) {
        contactsSelected.classList.add('d-none');
        deleteContactsButton.classList.add('d-none');
    } else {
        contactsSelected.classList.remove('d-none');
        deleteContactsButton.classList.remove('d-none');
        contactsSelected.innerHTML = `${arrayLength} seleccionados`
    }
}

/**
 * @method deleteOneContact
 * @description Delete only one contact
 * @param {object} e event information
 */
function deleteOneContact(e) {
    const contactID = e.currentTarget.getAttribute('data-id');
    const requestInfo = {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    };

    const deletedContact = apiRequest(`${BASE_URL}contacts/${contactID}`, requestInfo);
    deletedContact.then((response) => {
        console.log(response);
        getContacts();
    }).catch((error) => { console.log(error) });
}


/**
 * @method deleteContacts
 * @description Delete multiple contacts
 */
function deleteContacts() {
    const requestInfo = {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    };
    contactsIDArray.map(contactID => {
        const deletedContact = apiRequest(`${BASE_URL}contacts/${contactID}`, requestInfo);
        deletedContact.then((response) => {
            console.log(response);
            getContacts();
        }).catch((error) => { console.log(error) });
    });
}

getContacts();

export {

    getContacts

};