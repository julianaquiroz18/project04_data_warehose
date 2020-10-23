const CryptoJS = require("crypto-js");
const User = require('../models/users');

/**
 * Authentication
 */
async function login(req, res, next) {
    const userLogin = req.body.user;
    const passwordLogin = req.body.password;
    const userInfo = await User.findOne({ email: userLogin });

    if (!userInfo) {
        const error = new Error("Wrong user/email");
        error.status = 401;
        return next(error);
    };
    if (passwordLogin != decryptPassword(userInfo.password)) {
        const error = new Error("Wrong password");
        error.status = 401;
        return next(error);
    };
    req.userInfo = userInfo;
    next();
};

function decryptPassword(cipherPassword) {
    const bytes = CryptoJS.AES.decrypt(cipherPassword, `${process.env.SECRET_KEY_PASS}`);
    return bytes.toString(CryptoJS.enc.Utf8);
}

module.exports = {
    login
}