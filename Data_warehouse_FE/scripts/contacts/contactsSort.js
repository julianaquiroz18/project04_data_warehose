import { apiRequest } from '../services.js';
import { fillContactsInfo } from './getAndDeleteContacts.js'
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

/**
 * Global variables
 */
const ascButtonsArray = document.querySelectorAll('.asc-sort');
const descButtonsArray = document.querySelectorAll('.desc-sort');

/**
 * Events
 */
ascButtonsArray.forEach((button) => button.addEventListener('click', ascSort));
descButtonsArray.forEach((button) => button.addEventListener('click', descSort));

/**
 * @method ascSort
 * @description Method to get contacts in ascendent order
 * @param {object} e event information 
 */
function ascSort(e) {
    const index = Number(e.currentTarget.getAttribute('data-index'));
    const field = e.currentTarget.getAttribute('data-field');
    const sort = "asc";
    ascButtonsArray[index].classList.add('d-none');
    descButtonsArray[index].classList.remove('d-none');
    sortRequest(sort, field);
}

/**
 * @method descSort
 * @description Method to get contacts in descendent order
 * @param {object} e event information 
 */
function descSort(e) {
    const index = Number(e.currentTarget.getAttribute('data-index'));
    const field = e.currentTarget.getAttribute('data-field');
    const sort = "desc";
    descButtonsArray[index].classList.add('d-none');
    ascButtonsArray[index].classList.remove('d-none');
    sortRequest(sort, field);
}


/**
 * @method sortRequest
 * @description Method to request contacts
 * @param {sort} sort
 * @param {sort} field
 */
function sortRequest(sort, field) {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    };

    const sortContacts = apiRequest(`${BASE_URL}contacts-sort?sort=${sort}&field=${field}`, requestInfo);
    sortContacts.then((response) => {
        document.querySelector(".contacts-body-table").innerHTML = "";
        fillContactsInfo(response);
    }).catch((error) => { console.log(error) });
}