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
                    response.text().then(text => {
                        const error = JSON.parse(text);
                        swal(`Error! ${error.code}`, error.error, "error");
                        console.error(text);
                    });
                };
            })
            .catch(error => { reject(error) })
    });
}

export {

    apiRequest

};