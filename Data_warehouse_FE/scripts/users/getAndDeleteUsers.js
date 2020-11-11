import { apiRequest } from '../services.js';
import { editUser } from '../users/editUser.js';
const BASE_URL = "/data_wharehose/v1/";

/**
 * Global Variables
 */
const usersBodyTable = document.querySelector(".users-body-table");

/**
 * @method getUsers
 * @description Method to get users from API
 */
function getUsers() {
    usersBodyTable.innerHTML = "";
    const requestInfo = {
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    }
    const usersList = apiRequest(`${BASE_URL}users`, requestInfo);
    usersList.then((response) => {
        fillUsersInfo(response);
    }).catch((error) => { console.log(error) });
};

/**
 * @method fillUsersInfo
 * @description Get user data and create rows
 * @param {array} userList
 */
function fillUsersInfo(userList) {
    const userHTML = userList.map(user => {
        const id = user._id;
        const name = user.name;
        const lastname = user.lastname;
        const email = user.email;
        const profile = (user.isAdmin) ? "Administrador" : "Usuario";
        return usersMarkUp(id, name, lastname, email, profile);
    });
    usersBodyTable.innerHTML += userHTML.join("\n");
    usersBodyTable.querySelectorAll('.delete').forEach((button) => button.addEventListener('click', deleteUser));
    usersBodyTable.querySelectorAll('.edit').forEach((button) => button.addEventListener('click', editUser));
};

/**
 * @method usersMarkUp
 * @description Rows marking method
 * @param {string} id
 * @param {string} name
 * @param {string} lastname
 * @param {string} email
 * @param {string} profile
 * @return {string}
 */
function usersMarkUp(id, name, lastname, email, profile) {
    return (
        `<tr>
        <td class="align-middle pl-5">${name}</td>
        <td class="align-middle">${lastname}</td>
        <td class="align-middle pl-5">${email}</td>
        <td class="align-middle">${profile}</td>
        <td class="align-middle">
            <button type="button" class="btn btn-lg text-black-50 ml-n3 delete" data-id="${id}"><i class="fa fa-trash" aria-hidden="true"></i></button>
            <button type="button" class="btn btn-lg text-black-50 edit" data-id="${id}" data-toggle="modal" data-target="#edit-user"><i class="fa fa-pencil" aria-hidden="true"></i></button>
        </td>
    </tr>`
    );
};


/**
 * @method deleteUser
 * @description Delete user
 * @param {object} e event information
 */
function deleteUser(e) {
    const userID = e.currentTarget.getAttribute('data-id');
    const requestInfo = {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${JSON.parse(localStorage.getItem("token"))}` }
    };

    const deletedUser = apiRequest(`${BASE_URL}users/${userID}`, requestInfo);
    deletedUser.then((response) => {
        swal("", response.message, "success");
        getUsers();
    }).catch((error) => { console.log(error) });
}

getUsers();


export {

    getUsers

};