const { Contact } = require('../models/contacts');

/**
 * Check if contact already exist
 */
async function checkContact(req, res, next) {
    const contactInfo = await Contact.findOne({ email: req.body.email });

    if (!contactInfo) {
        next();
    } else {
        const error = new Error("Contact (email) already exist");
        error.status = 409;
        next(error);
    }
}


/**
 * Check if contactID is valid
 */
async function checkContactID(req, res, next) {
    const contactInfo = await Contact.findById(req.params.contactID).exec();
    if (contactInfo) {
        next();
    } else {
        const error = new Error("Invalid Contact ID. Contact does not exist");
        error.status = 404;
        next(error);
    }
};


/**
 * Check if contact already exist to update user Information
 */
async function checkContactToUpdate(req, res, next) {
    const currentInfo = await Contact.findById(req.params.contactID).exec();
    const currentEmail = currentInfo.email;
    const newEmail = req.body.email;

    if (newEmail === currentEmail) {
        return next();
    }

    checkContact(req, res, next);
}

module.exports = {
    checkContactID,
    checkContact,
    checkContactToUpdate
}