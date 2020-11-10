import { apiRequest } from '../services.js';
import { getUsers } from './getAndDeleteUsers.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

/**
 * Global Variables
 */
const createButton = document.querySelector(".create");
createButton.addEventListener('click', createUser);

/**
 * Events
 */
$('#new-user').on('hide.bs.modal', () => { document.getElementById("new-user-form").reset() });


/**
 * @method createUser
 * @description Method to create user 
 */
function createUser() {
    const userData = {
        "name": document.querySelector("#name").value,
        "lastname": document.querySelector("#lastname").value,
        "email": document.querySelector("#email").value,
        "isAdmin": document.querySelector("#profile").value,
        "password": document.querySelector("#password").value,
        "repeatPassword": document.querySelector("#repeat-password").value
    }
    const requestInfo = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}`
        }
    }
    const login = apiRequest(`${BASE_URL}users`, requestInfo);
    login.then(json => {
        swal("", `Usuario ${json.name} ${json.lastname} fue creado exitosamente`, "success");
        getUsers();
    }).catch((error) => {
        console.log(error);

    });
}