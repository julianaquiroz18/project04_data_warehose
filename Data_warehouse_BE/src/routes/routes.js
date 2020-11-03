const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Company = require('../models/companies');
const { Region, Country, City } = require('../models/cities');
const { Contact } = require('../models/contacts');

/**
 * Middlewares
 */
const { login } = require('../middlewares/authentication');
const { getUserInfo, checkIfAdmin, checkPassword, checkUser, checkUserID, checkUserToUpdate } = require('../middlewares/users');
const { checkCompany, checkCompanyID, checkCompanyToUpdate } = require('../middlewares/companies');
const { checkContact, checkContactID, checkContactToUpdate, getFilterFields } = require('../middlewares/contacts');
const { checkRegionID, checkRegion, checkRegionToUpdate, checkCountryID, checkCountry, checkCountryToUpdate, checkCityID, checkCity, checkCityToUpdate } = require('../middlewares/cities');
const { jwtGenerator, jwtExtract, verifyToken } = require('../middlewares/jwt');



/**
 * Schema validator
 */
const { registerSchema, updateRegisterSchema, companySchema, contactSchema, regionSchema, countrySchema, citySchema } = require('../schemas/schemas');
const { Validator } = require('express-json-validator-middleware');
const validator = new Validator({ allErrors: true });
const validate = validator.validate;



/**
 * Login
 */
router.post("/users/login", login, jwtGenerator, (req, res) => {
    res.status(200).json({
        message: "Successful login",
        token: req.token
    });
});


//Users CRUD

/**
 * Get user list (Only admin)
 */
router.get("/users", jwtExtract, verifyToken, checkIfAdmin, async(req, res) => {
    const userList = await User.find();
    res.status(200).json(userList);
});

/**
 * Get User by ID
 */
router.get("/users/:userID", jwtExtract, verifyToken, async(req, res) => {
    const user = await User.findById(req.params.userID).exec();
    res.status(200).json(user);
});


/**
 * User registration (only admin)
 */
router.post("/users", jwtExtract, verifyToken, checkIfAdmin, validate({ body: registerSchema }), checkPassword, checkUser, getUserInfo, async(req, res) => {
    const newUser = new User(req.userRegistrationInfo);
    newUser.repeatPassword = undefined;
    await newUser.save();
    newUser.password = undefined;
    res.status(201).json(newUser);
});

/**
 * Delete user (only admin)
 */
router.delete("/users/:userID", jwtExtract, verifyToken, checkIfAdmin, checkUserID, async(req, res) => {
    await User.deleteOne({ _id: req.params.userID })
    res.status(200).json({ message: "User was deleted" });
});

/**
 * Update user (only admin)
 */
router.put("/users/:userID", jwtExtract, verifyToken, checkIfAdmin, checkUserID, validate({ body: updateRegisterSchema }), checkPassword, checkUserToUpdate, getUserInfo, async(req, res) => {
    delete req.userRegistrationInfo.repeatPassword;
    await User.updateOne({ _id: req.params.userID }, req.userRegistrationInfo);
    res.status(200).json({ message: "User information was updated" });
});


//Companies CRUD

/**
 * Get companies list 
 */
router.get("/companies", jwtExtract, verifyToken, async(req, res) => {
    const companiesList = await Company.find().populate({ path: "city", select: ['name'], populate: { path: "country", select: ['name'], populate: { path: "region", select: ['name'] } } }).exec();
    //const companiesList = await Company.find().populate("city", ['name']).exec();
    res.status(200).json(companiesList);
});

/**
 * Get Company by ID
 */
router.get("/companies/:companyID", jwtExtract, verifyToken, async(req, res) => {
    const company = await Company.findById(req.params.companyID).exec();
    res.status(200).json(company);
});

/**
 * Companies registration 
 */
router.post("/companies", jwtExtract, verifyToken, validate({ body: companySchema }), checkCompany, async(req, res) => {
    const newCompany = new Company(req.body);
    await newCompany.save();
    res.status(201).json(newCompany);
});

/**
 * Delete companies 
 */
router.delete("/companies/:companyID", jwtExtract, verifyToken, checkCompanyID, async(req, res) => {
    await Company.deleteOne({ _id: req.params.companyID })
    res.status(200).json({ message: "Company was deleted" });
});

/**
 * Update companies
 */
router.put("/companies/:companyID", jwtExtract, verifyToken, checkCompanyID, validate({ body: companySchema }), checkCompanyToUpdate, async(req, res) => {
    await Company.updateOne({ _id: req.params.companyID }, req.body);
    res.status(200).json({ message: "Company information was updated" });
});

//Contacts CRUD

/**
 * Get contacts list 
 */
router.get("/contacts", jwtExtract, verifyToken, async(req, res) => {
    const contactsList = await Contact.find().populate("company", ['name']).populate({ path: "city", select: ['name'], populate: { path: "country", select: ['name'], populate: { path: "region", select: ['name'] } } }).exec();
    res.status(200).json(contactsList);
});

/**
 * Get Contact by ID
 */
router.get("/contacts/:contactID", jwtExtract, verifyToken, async(req, res) => {
    const contact = await Contact.findById(req.params.contactID).exec();
    res.status(200).json(contact);
});


/**
 * Get contacts filtered
 */
router.get("/contacts/filter", jwtExtract, verifyToken, getFilterFields, async(req, res) => {
    const contactsList = await Contact.find(req.filterFields).exec();
    res.status(200).json(contactsList);
});

/**
 * Contacts registration 
 */
router.post("/contacts", jwtExtract, verifyToken, validate({ body: contactSchema }), checkContact, async(req, res) => {
    const newContact = new Contact(req.body);
    await newContact.save();
    res.status(201).json(newContact);
});

/**
 * Delete contacts 
 */
router.delete("/contacts/:contactID", jwtExtract, verifyToken, checkContactID, async(req, res) => {
    await Contact.deleteOne({ _id: req.params.contactID })
    res.status(200).json({ message: "Contact was deleted" });
});

/**
 * Update contacts
 */
router.put("/contacts/:contactID", jwtExtract, verifyToken, checkContactID, validate({ body: contactSchema }), checkContactToUpdate, async(req, res) => {
    await Contact.updateOne({ _id: req.params.contactID }, req.body);
    res.status(200).json({ message: "Contact information was updated" });
});



//City-Country-Regions CRUD

/**
 * Create
 */
router.post("/regions", jwtExtract, verifyToken, validate({ body: regionSchema }), checkRegion, async(req, res) => {
    const newRegion = new Region(req.body);
    await newRegion.save();
    res.status(201).json(newRegion);
});

router.post("/countries", jwtExtract, verifyToken, validate({ body: countrySchema }), checkCountry, async(req, res) => {
    const region = await Region.findById(req.body.regionID).exec();
    const newCountry = new Country(req.body);
    await newCountry.save();
    region.countries.push(newCountry);
    await region.save();
    res.status(201).json(newCountry);
});

router.post("/cities", jwtExtract, verifyToken, validate({ body: citySchema }), checkCity, async(req, res) => {
    const country = await Country.findById(req.body.countryID).exec();
    const newCity = new City(req.body);
    await newCity.save();
    country.cities.push(newCity);
    await country.save();
    res.status(201).json(newCity);
});

/**
 * Get
 */
router.get("/regions", jwtExtract, verifyToken, async(req, res) => {
    const regionsList = await Region.find({}, ['name']).populate({ path: 'countries', select: ['name'], populate: { path: 'cities', select: ['name'] } }).exec();
    res.status(200).json(regionsList);
});

router.get("/countries", jwtExtract, verifyToken, async(req, res) => {
    const countriesList = await Country.find({}, ['name']).populate('cities', ['name']).exec();
    res.status(200).json(countriesList);
});

router.get("/cities", jwtExtract, verifyToken, async(req, res) => {
    const citiesList = await City.find({}, ['name']);
    res.status(200).json(citiesList);
});

/**
 * Get countries from a specific region
 */
router.get("/countries/:regionID", jwtExtract, verifyToken, async(req, res) => {
    const countriesList = await Region.findById(req.params.regionID, ['name']).populate('countries', ['name']).exec();
    res.status(200).json(countriesList);
});

/**
 * Get cities from a specific country
 */
router.get("/cities/:countryID", jwtExtract, verifyToken, async(req, res) => {
    const citiesList = await Country.findById(req.params.countryID, ['name']).populate('cities', ['name']).exec();
    res.status(200).json(citiesList);
});

/**
 * Delete
 */
router.delete("/regions/:regionID", jwtExtract, verifyToken, checkRegionID, async(req, res) => {
    await Region.deleteOne({ _id: req.params.regionID })
    res.status(200).json({ message: "Region was deleted" });
});

router.delete("/countries/:countryID", jwtExtract, verifyToken, checkCountryID, async(req, res) => {
    await Country.deleteOne({ _id: req.params.countryID })
    res.status(200).json({ message: "Country was deleted" });
});

router.delete("/cities/:cityID", jwtExtract, verifyToken, checkCityID, async(req, res) => {
    await City.deleteOne({ _id: req.params.cityID })
    res.status(200).json({ message: "City was deleted" });
});

/**
 * Update
 */
router.put("/regions/:regionID", jwtExtract, verifyToken, checkRegionID, validate({ body: regionSchema }), checkRegionToUpdate, async(req, res) => {
    await Region.updateOne({ _id: req.params.regionID }, req.body);
    res.status(200).json({ message: "Region information was updated" });
});

router.put("/countries/:countryID", jwtExtract, verifyToken, checkCountryID, validate({ body: countrySchema }), checkCountryToUpdate, async(req, res) => {
    await Country.updateOne({ _id: req.params.countryID }, req.body);
    res.status(200).json({ message: "Country information was updated" });
});

router.put("/cities/:cityID", jwtExtract, verifyToken, checkCityID, validate({ body: citySchema }), checkCityToUpdate, async(req, res) => {
    await City.updateOne({ _id: req.params.cityID }, req.body);
    res.status(200).json({ message: "City information was updated" });
});

module.exports = {
    router: router
}