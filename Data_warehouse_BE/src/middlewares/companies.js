const Company = require('../models/companies');

/**
 * Check if company already exist
 */
async function checkCompany(req, res, next) {
    const companyInfo = await Company.findOne({ email: req.body.email });

    if (!companyInfo) {
        next();
    } else {
        const error = new Error("Company (email) already exist");
        error.status = 409;
        next(error);
    }
}


/**
 * Check if companyID is valid
 */
async function checkCompanyID(req, res, next) {
    const companyInfo = await Company.findById(req.params.companyID).exec();
    if (companyInfo) {
        next();
    } else {
        const error = new Error("Invalid Company ID. Company does not exist");
        error.status = 404;
        next(error);
    }
};


/**
 * Check if company already exist to update user Information
 */
async function checkCompanyToUpdate(req, res, next) {
    const currentInfo = await Company.findById(req.params.companyID).exec();
    const currentEmail = currentInfo.email;
    const newEmail = req.body.email;

    if (newEmail === currentEmail) {
        return next();
    }

    checkCompany(req, res, next);
}

module.exports = {
    checkCompanyID,
    checkCompany,
    checkCompanyToUpdate
}