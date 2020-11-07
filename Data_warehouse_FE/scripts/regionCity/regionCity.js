import { apiRequest } from '../services.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

/**
 * Global Variables
 */
const regionBody = document.querySelector(".regions-body");
const editRegionBtn = document.querySelector(".update-region");
const editCountryBtn = document.querySelector(".update-country");
const editCityBtn = document.querySelector(".update-city");
const newRegionBtn = document.querySelector(".new-region");
const addRegionBtn = document.querySelector(".add-region");
const addCountryBtn = document.querySelector(".add-country");
const addCityBtn = document.querySelector(".add-city");
let id;
let requestTo;

/**
 * Events
 */
editRegionBtn.addEventListener("click", editFunction);
editCountryBtn.addEventListener("click", editFunction);
editCityBtn.addEventListener("click", editFunction);
addRegionBtn.addEventListener("click", createFunction);
addCountryBtn.addEventListener("click", createFunction);
addCityBtn.addEventListener("click", createFunction);
newRegionBtn.addEventListener("click", getInfo);
$('#new-region').on('hide.bs.modal', () => { document.getElementById("new-region-form").reset() });
$('#edit-region').on('hide.bs.modal', () => { document.getElementById("edit-region-form").reset() });
$('#new-country').on('hide.bs.modal', () => { document.getElementById("new-country-form").reset() });
$('#edit-country').on('hide.bs.modal', () => { document.getElementById("edit-country-form").reset() });
$('#new-city').on('hide.bs.modal', () => { document.getElementById("new-city-form").reset() });
$('#edit-city').on('hide.bs.modal', () => { document.getElementById("edit-city-form").reset() });



/**
 * @method getRegions
 * @description Method to get Region information from API
 */
function getRegions() {
    regionBody.innerHTML = "";
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const regionsList = apiRequest(`${BASE_URL}regions`, requestInfo);
    regionsList.then((response) => {
        fillRegionInfo(response);
    }).catch((error) => { console.log(error) });
}


/**
 * @method fillRegionInfo
 * @description Get region data and create list
 * @param {array} regionList
 */
async function fillRegionInfo(regionList) {
    const regionHTML = await Promise.all(regionList.map(async region => {
        const id = region._id;
        const name = region.name;
        const countries = await getCountries(id);
        const countriesMarkup = await fillCountriesInfo(countries)
        return regionsMarkUp(id, name, countriesMarkup);
    }));
    regionBody.innerHTML += regionHTML.join("\n");
    const toggler = document.getElementsByClassName("caret");
    for (let i = 0; i < toggler.length; i++) {
        toggler[i].addEventListener("click", function() {
            this.parentElement.querySelector(".nested").classList.toggle("active");
            this.classList.toggle("caret-down");
        });
    }
    document.querySelectorAll('.ellipsis').forEach((button) => button.addEventListener('mouseenter', showOptions));
    document.querySelectorAll('.list-group-item').forEach((button) => button.addEventListener('mouseleave', hideOptions));
    document.querySelectorAll('.edit').forEach((button) => button.addEventListener('click', getInfo));
    document.querySelectorAll('.new').forEach((button) => button.addEventListener('click', getInfo));
    document.querySelectorAll('.delete').forEach((button) => button.addEventListener('click', deleteFunction));

}

/**
 * @method getCountries
 * @description Method to get countries by RegionID
 */
async function getCountries(regionID) {
    try {
        const requestInfo = {
            headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
        }
        const countriesList = await apiRequest(`${BASE_URL}countries/${regionID}`, requestInfo);
        return countriesList.countries;
    } catch (error) {
        console.log(error);
    }

}

/**
 * @method fillCountriesInfo
 * @description Get country data and create list
 * @param {array} countriesList
 */
async function fillCountriesInfo(countriesList) {
    let countriesHTML = await Promise.all(countriesList.map(async country => {
        const id = country._id;
        const name = country.name;
        const cities = await getCities(id);
        const citiesMarkup = fillCitiesInfo(cities)
        return countriesMarkUp(id, name, citiesMarkup);
    }));
    return countriesHTML.join("\n");

}


/**
 * @method getCities
 * @description Method to get cities by countryID
 */
async function getCities(countryID) {
    try {
        const requestInfo = {
            headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
        }
        const citiesList = await apiRequest(`${BASE_URL}cities/${countryID}`, requestInfo);
        return citiesList.cities;
    } catch (error) {
        console.log(error);
    }

}

/**
 * @method fillCitiesInfo
 * @description Get city data and create list
 * @param {array} citiesList
 */
function fillCitiesInfo(citiesList) {
    let citiesHTML = (citiesList.map(city => {
        const id = city._id;
        const name = city.name;
        return citiesMarkUp(id, name);
    }));
    return citiesHTML.join("\n");
}


/**
 * @method regionsMarkUp
 * @description Region list marking method
 * @param {string} id
 * @param {string} name
 * @return {string}
 */
function regionsMarkUp(id, name, countriesMarkup) {
    return (
        `<li class="list-group-item"><span class="caret">${name}</span>
            <button type="button" class="btn text-black-50 ellipsis"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></button>
            <button type="button" class="d-none btn btn-lg text-black-50 edit" data-info="regions" data-id="${id}" data-toggle="modal" data-target="#edit-region"><i class="fa fa-pencil" aria-hidden="true"></i></button>
            <button type="button" class="d-none btn btn-lg text-black-50 delete" data-info="regions" data-id="${id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
            <button type="button" class="d-none btn btn-secondary text-black btn-sm ml-3 new" data-info="countries" data-id="${id}" data-toggle="modal" data-target="#new-country">Añadir país</button>
            <ul class="nested pl-5 list-group list-group-flush countries-Body">
                ${countriesMarkup}
            </ul>
        </li>`
    )
}


/**
 * @method countriesMarkUp
 * @description Countries list marking method
 * @param {string} id
 * @param {string} name
 * @return {string}
 */
function countriesMarkUp(id, name, citiesMarkup) {
    return (
        `<li class="list-group-item"><span class="caret">${name}</span>
            <button type="button" class="btn text-black-50 ellipsis"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></button>
            <button type="button" class="d-none btn btn-lg text-black-50 edit" data-info="countries" data-id="${id}" data-toggle="modal" data-target="#edit-country"><i class="fa fa-pencil" aria-hidden="true"></i></button>
            <button type="button" class="d-none btn btn-lg text-black-50 delete" data-info="countries" data-id="${id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
            <button type="button" class="d-none btn btn-secondary text-black btn-sm ml-3 new" data-info="cities" data-id="${id}" data-toggle="modal" data-target="#new-city">Añadir ciudad</button>
            <ul class="nested pl-5 list-group list-group-flush cities-Body">
                ${citiesMarkup}
            </ul>
        </li>`
    )
}


/**
 * @method citiesMarkUp
 * @description Countries list marking method
 * @param {string} id
 * @param {string} name
 * @return {string}
 */
function citiesMarkUp(id, name) {
    return (
        `<li class="list-group-item">${name}
        <button type="button" class="btn text-black-50 ellipsis"><i class="fa fa-ellipsis-h" aria-hidden="true"></i></button>
        <button type="button" class="d-none btn btn-lg text-black-50 edit" data-info="cities" data-id="${id}" data-toggle="modal" data-target="#edit-city"><i class="fa fa-pencil" aria-hidden="true"></i></button>
        <button type="button" class="d-none btn btn-lg text-black-50 delete" data-info="cities" data-id="${id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
    </li>`
    )
}

/**
 * @method showOptions
 * @description Update UI for show options when hover ellipsis
 * @param {object} e Event information
 */
function showOptions(e) {
    e.currentTarget.parentElement.querySelector('.ellipsis').classList.toggle('d-none');
    e.currentTarget.parentElement.querySelector('.edit').classList.toggle('d-none');
    e.currentTarget.parentElement.querySelector('.delete').classList.toggle('d-none');
    e.currentTarget.parentElement.querySelector('.new').classList.toggle('d-none');
}

/**
 * @method hideOptions
 * @description Update UI for hide options when mpuse out from the list element
 * @param {object} e Event information
 */
function hideOptions(e) {
    e.currentTarget.querySelector('.ellipsis').classList.remove('d-none');
    e.currentTarget.querySelector('.edit').classList.add('d-none');
    e.currentTarget.querySelector('.delete').classList.add('d-none');
    e.currentTarget.querySelector('.new').classList.add('d-none');
}

/**
 * @method getInfo
 * @description Get ID and data base request to be used in CRUD operations
 * @param {object} e Event information
 */
function getInfo(e) {
    id = e.currentTarget.getAttribute('data-id');
    requestTo = e.currentTarget.getAttribute('data-info');
}

/**
 * @method editFunction
 * @description Update region, country or city name
 */
function editFunction(e) {
    const newName = {
        "name": e.currentTarget.parentElement.parentElement.getElementsByTagName("input")[0].value
    }
    const requestInfo = {
        method: 'PUT',
        body: JSON.stringify(newName),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    };
    const login = apiRequest(`${BASE_URL}${requestTo}/${id}`, requestInfo);
    login.then(json => {
        getRegions();
    }).catch((error) => { console.log(error) });
}

/**
 * @method createFunction
 * @description Update region, country or city name
 */
function createFunction(e) {
    let newInfo;
    switch (requestTo) {
        case "regions":
            newInfo = {
                "name": e.currentTarget.parentElement.parentElement.getElementsByTagName("input")[0].value,
                "countries": []
            };
            break;
        case "countries":
            newInfo = {
                "name": e.currentTarget.parentElement.parentElement.getElementsByTagName("input")[0].value,
                "region": id,
                "cities": []
            };
            break;
        case "cities":
            newInfo = {
                "name": e.currentTarget.parentElement.parentElement.getElementsByTagName("input")[0].value,
                "country": id
            };
            break;
        default:
            break;
    }

    const requestInfo = {
        method: 'POST',
        body: JSON.stringify(newInfo),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    };
    const login = apiRequest(`${BASE_URL}${requestTo}`, requestInfo);
    login.then(json => {
        getRegions();
    }).catch((error) => { console.log(error) });

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
        contactsIDArray = [];
        updateContactsUI();
        getContacts();
    }).catch((error) => { console.log(error) });
}

/**
 * @method deleteFunction
 * @description Delete multiple contacts
 */
function deleteFunction(e) {
    getInfo(e);
    const requestInfo = {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    };
    const deletedRegionCountryOrCity = apiRequest(`${BASE_URL}${requestTo}/${id}`, requestInfo);
    deletedRegionCountryOrCity.then((response) => {
        getRegions();
    }).catch((error) => { console.log(error) });
}

getRegions()