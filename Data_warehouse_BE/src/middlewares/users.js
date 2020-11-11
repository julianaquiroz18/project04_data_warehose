const User = require('../models/users');
const CryptoJS = require("crypto-js");

/**
 * Get user information from registration
 */
function getUserInfo(req, res, next) {
    req.userRegistrationInfo = {
        name: req.body.name,
        lastname: req.body.lastname,
        email: req.body.email,
        isAdmin: req.body.isAdmin,
        password: encryptPassword(req.body.password),
        repeatPassword: encryptPassword(req.body.repeatPassword)
    };
    next();
};

function encryptPassword(password) {
    return CryptoJS.AES.encrypt(password, `${process.env.SECRET_KEY_PASS}`).toString();
};

/**
 * Check if user is admin
 */
function checkIfAdmin(req, res, next) {
    if (req.userInfo.isAdmin === false) {
        const error = new Error("You don't have permission to complete this action");
        error.status = 403;
        next(error);
    } else {
        next();
    };
};

/**
 * Confirm if passwords match
 */
function checkPassword(req, res, next) {
    if (req.body.password != req.body.repeatPassword) {
        const error = new Error("Passwords does not match");
        error.status = 400;
        next(error);
    } else {
        next();
    };
};

/**
 * Check if user already exist
 */
async function checkUser(req, res, next) {
    const userInfo = await User.findOne({ email: req.body.email });

    if (!userInfo) {
        next();
    } else {
        const error = new Error("User (email) already exist");
        error.status = 409;
        next(error);
    }
}

/**
 * Check if userID is valid
 */
async function checkUserID(req, res, next) {
    const userInfo = await User.findById(req.params.userID).exec();
    if (userInfo) {
        next();
    } else {
        const error = new Error("Invalid User ID. User does not exist");
        error.status = 404;
        next(error);
    }
};


/**
 * Check if user already exist to update user Information
 */
async function checkUserToUpdate(req, res, next) {
    const currentInfo = await User.findById(req.params.userID).exec();
    const currentEmail = currentInfo.email;
    const newEmail = req.body.email;

    if (newEmail === currentEmail) {
        return next();
    }

    checkUser(req, res, next);
}



module.exports = {
    getUserInfo,
    checkIfAdmin,
    checkPassword,
    checkUser,
    checkUserID,
    checkUserToUpdate,
    encryptPassword

}