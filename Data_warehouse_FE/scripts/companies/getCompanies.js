import { apiRequest } from '../services.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

const companiesBodyTable = document.querySelector(".companies-body-table");

/**
 * @method getCompanies
 * @description Method to get companies from API
 */
function getCompanies() {
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const companiesList = apiRequest(`${BASE_URL}companies`, requestInfo);
    companiesList.then((response) => {
        console.log(response);
        fillCompaniesInfo(response);
    }).catch((error) => { console.log(error) });
}

/**
 * @method fillCompaniesInfo
 * @description Get company data and create rows
 * @param {array} companiesList
 */
function fillCompaniesInfo(companiesList) {
    const companyHTML = companiesList.map(company => {
        const id = company._id;
        const name = company.name;
        const address = company.address;
        const email = company.email;
        const telephone = company.telephone;
        const city = company.city.name;
        return companiesMarkUp(id, name, address, email, telephone, city);
    });
    companiesBodyTable.innerHTML += companyHTML.join("\n");
}

/**
 * @method companiesMarkUp
 * @description Rows marking method
 * @param {string} id
 * @param {string} name
 * @param {string} address
 * @param {string} email
 * @param {string} telephone
 * @param {string} city
 * @return {string}
 */
function companiesMarkUp(id, name, address, email, telephone, city) {
    return (
        `<tr>
        <td class="align-middle pl-5">${name}</td>
        <td class="align-middle">${address}</td>
        <td class="align-middle pl-5">${email}</td>
        <td class="align-middle">${telephone}</td>
        <td class="align-middle">${city}</td>
        <td class="align-middle">
            <button type="button" class="btn btn-lg text-black-50 ml-n3" data-id:"${id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
            <button type="button" class="btn btn-lg text-black-50" data-id:"${id}"><i class="fa fa-pencil" aria-hidden="true"></i></button>
        </td>
    </tr>`
    );
}

getCompanies();

export {

    getCompanies

};