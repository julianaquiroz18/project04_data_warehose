/**
 * @method apiRequest
 * @description Get info from API
 * @param {string} URL
 * @returns {promise}
 */
function apiGetRequest(URL) {
    return new Promise((resolve, reject) => {
        fetch(URL)
            .then(response => { resolve(response.json()) })
            .catch(error => { reject(error) })
    });
}

/**
 * @method apiRequest
 * @description Get info from API
 * @param {string} URL
 * @param {object} requestInfo
 * @returns {promise}
 */
function apiRequest(URL, requestInfo) {
    return new Promise((resolve, reject) => {
        fetch(URL, requestInfo)
            .then(response => {
                if (response.ok) {
                    resolve(response.json());
                } else {
                    response.text().then(text => console.error(text));
                };
            })
            .catch(error => { reject(error) })
    });
}



export {

    apiGetRequest,
    apiRequest

};