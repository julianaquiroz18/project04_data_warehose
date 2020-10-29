import { apiRequest } from '../services.js';
import { getUsers } from './getAndDeleteUsers.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

const updateButton = document.querySelector(".update-button");
let name = document.querySelector("#edit-name");
let lastname = document.querySelector("#edit-lastname");
let email = document.querySelector("#edit-email");
let isAdmin = document.querySelector("#edit-profile");
let password = document.querySelector("#edit-password");
let repeatPassword = document.querySelector("#edit-repeat-password");
let userID;

updateButton.addEventListener('click', updateUser);

$('#edit-user').on('hide.bs.modal', () => { document.getElementById("edit-user-form").reset() });

async function editUser(e) {
    userID = e.currentTarget.getAttribute('data-id');
    const userCurrentData = await getUserData(userID);
    if (userCurrentData instanceof Error) {
        console.log(userCurrentData)
    }
    fillModal(userCurrentData);
}


async function getUserData(userID) {
    try {
        const requestInfo = {
            headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
        }
        const userCurrentData = await apiRequest(`${BASE_URL}users/${userID}`, requestInfo);
        return userCurrentData;
    } catch (error) {
        return error;
    }
}


function fillModal(userCurrentData) {
    name.value = userCurrentData.name;
    lastname.value = userCurrentData.lastname;
    email.value = userCurrentData.email;
    isAdmin.value = userCurrentData.isAdmin;
}

function updateUser() {
    const newUserData = {
        "name": name.value,
        "lastname": lastname.value,
        "email": email.value,
        "isAdmin": isAdmin.value,
    }
    if (password.value && repeatPassword.value && (password.value === repeatPassword.value)) {
        newUserData.password = password.value;
        newUserData.repeatPassword = password.value;
    }

    const requestInfo = {
        method: 'PUT',
        body: JSON.stringify(newUserData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    }
    const login = apiRequest(`${BASE_URL}users/${userID}`, requestInfo);
    login.then(json => {
        console.log(json);
        getUsers();
    }).catch((error) => { console.log(error) });

}

export {
    editUser
};