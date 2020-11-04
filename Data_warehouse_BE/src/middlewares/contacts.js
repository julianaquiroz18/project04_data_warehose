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
 * Check if contact already exist to update contact Information
 */
async function checkContactToUpdate(req, res, next) {
    const currentInfo = await Contact.findById(req.params.contactID).exec();
    const currentEmail = currentInfo.email;
    const newEmail = req.body.email;

    if (newEmail === currentEmail) {
        return next();
    }

    checkContact(req, res, next);
};

/**
 * Get filtered field info
 */
function getFilterFields(req, res, next) {
    req.filterFields = {
        name: { $regex: '.*' + req.body.name + '.*', $options: 'i' },
        position: { $regex: '.*' + req.body.position + '.*', $options: 'i' },
        city: req.body.city,
        company: req.body.company,
        contactChannel: { "$elemMatch": { contactChannel: `${req.body.favoriteChannel}`, preferences: "favorite" } },
        interest: req.body.interest
    };
    if (!req.body.name) {
        delete req.filterFields.name;
    }
    if (!req.body.position) {
        delete req.filterFields.position;
    }
    if (!req.body.city || req.body.city === "null") {
        delete req.filterFields.city;
    }
    if (!req.body.company || req.body.company === "null") {
        delete req.filterFields.company;
    }
    if (!req.body.favoriteChannel || req.body.favoriteChannel === "null") {
        delete req.filterFields.contactChannel;
    }
    if (!req.body.interest || req.body.interest === "null") {
        delete req.filterFields.interest;
    }
    next();
};

module.exports = {
    checkContactID,
    checkContact,
    checkContactToUpdate,
    getFilterFields
}