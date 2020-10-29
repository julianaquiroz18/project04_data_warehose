import { apiRequest } from '../services.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

const contactsBodyTable = document.querySelector(".contacts-body-table");

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
        `<tr>
        <td class="align-middle"><input class="ml-3" type="checkbox" name="user-info" data-id:"${id}></td>
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
            <button type="button" class="btn text-black-50"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></button>
            <button type="button" class="btn btn-lg text-black-50 d-none" data-id="${id}><i class="fa fa-trash" aria-hidden="true"></i></button>
            <button type="button" class="btn btn-lg text-black-50 d-none" data-id="${id}><i class="fa fa-pencil" aria-hidden="true"></i></button>
        </td>
    </tr>`
    );
}

getContacts();

export {

    getContacts

};