const { Region, Country, City } = require('../models/cities');

/**
 * Check if region already exist
 */
async function checkRegion(req, res, next) {
    const regionInfo = await Region.findOne({ name: req.body.name });

    if (!regionInfo) {
        next();
    } else {
        const error = new Error("Region already exist");
        error.status = 409;
        next(error);
    }
}


/**
 * Check if regionID is valid
 */
async function checkRegionID(req, res, next) {
    const regionInfo = await Region.findById(req.params.regionID).exec();
    if (regionInfo) {
        next();
    } else {
        const error = new Error("Invalid Region ID. Region does not exist");
        error.status = 404;
        next(error);
    }
};


/**
 * Check if region already exist to update region Information
 */
async function checkRegionToUpdate(req, res, next) {
    const currentInfo = await Region.findById(req.params.regionID).exec();
    const currentName = currentInfo.name;
    const newName = req.body.name;

    if (newName === currentName) {
        return next();
    }

    checkRegion(req, res, next);
}



/**
 * Check if Country already exist
 */
async function checkCountry(req, res, next) {
    const countryInfo = await Country.findOne({ name: req.body.name });

    if (!countryInfo) {
        next();
    } else {
        const error = new Error("Country already exist");
        error.status = 409;
        next(error);
    }
}


/**
 * Check if CountryID is valid
 */
async function checkCountryID(req, res, next) {
    const countryInfo = await Country.findById(req.params.countryID).exec();
    if (countryInfo) {
        next();
    } else {
        const error = new Error("Invalid Country ID. Country does not exist");
        error.status = 404;
        next(error);
    }
};


/**
 * Check if Country already exist to update Country Information
 */
async function checkCountryToUpdate(req, res, next) {
    const currentInfo = await Country.findById(req.params.countryID).exec();
    const currentName = currentInfo.name;
    const newName = req.body.name;

    if (newName === currentName) {
        return next();
    }

    checkCountry(req, res, next);
}







/**
 * Check if city already exist
 */
async function checkCity(req, res, next) {
    const cityInfo = await City.findOne({ name: req.body.name });

    if (!cityInfo) {
        next();
    } else {
        const error = new Error("City already exist");
        error.status = 409;
        next(error);
    }
}


/**
 * Check if CityID is valid
 */
async function checkCityID(req, res, next) {
    const cityInfo = await City.findById(req.params.cityID).exec();
    if (cityInfo) {
        next();
    } else {
        const error = new Error("Invalid city ID. City does not exist");
        error.status = 404;
        next(error);
    }
};


/**
 * Check if City already exist to update City Information
 */
async function checkCityToUpdate(req, res, next) {
    const currentInfo = await City.findById(req.params.cityID).exec();
    const currentName = currentInfo.name;
    const newName = req.body.name;

    if (newName === currentName) {
        return next();
    }

    checkCity(req, res, next);
}






module.exports = {
    checkRegionID,
    checkRegion,
    checkRegionToUpdate,
    checkCountryID,
    checkCountry,
    checkCountryToUpdate,
    checkCityID,
    checkCity,
    checkCityToUpdate
}