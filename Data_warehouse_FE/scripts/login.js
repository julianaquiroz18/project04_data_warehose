import { apiRequest } from './services.js';
const BASE_URL = "http://localhost:9092/data_wharehose/v1/";

const user = document.querySelector("#user");
const password = document.querySelector("#password");
const loginButton = document.querySelector(".login");

loginButton.addEventListener("click", login);

/**
 * @method login
 * @description Method to login and get authorization token
 */
function login() {
    const userData = {
        "user": user.value,
        "password": password.value
    }
    const requestInfo = {
        method: 'POST',
        body: JSON.stringify(userData),
        headers: { 'Content-Type': 'application/json' }
    }
    const login = apiRequest(`${BASE_URL}users/login`, requestInfo);
    login.then(json => {
        localStorage.setItem("token", JSON.stringify(json.token));
        localStorage.setItem("isAdmin", JSON.stringify(json.isAdmin));
        window.open('../views/contacts.html');
    }).catch((error) => { console.log(error) });
}