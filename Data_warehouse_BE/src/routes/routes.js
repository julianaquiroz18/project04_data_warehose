const express = require('express');
const router = express.Router();
const User = require('../models/users');
const Company = require('../models/companies');
const { Region, Country, City } = require('../models/cities');
const { Contact, ContactChannel } = require('../models/contacts');

/**
 * Middlewares
 */
const { login } = require('../middlewares/authentication');
const { getUserInfo, checkIfAdmin, checkPassword, checkUser, checkUserID, checkUserToUpdate } = require('../middlewares/users');
const { checkCompany, checkCompanyID, checkCompanyToUpdate } = require('../middlewares/companies');
const { checkContact, checkContactID, checkContactToUpdate } = require('../middlewares/contacts');
const { jwtGenerator, jwtExtract, verifyToken } = require('../middlewares/jwt');



/**
 * Schema validator
 */
const { registerSchema, companySchema, contactSchema } = require('../schemas/schemas');
const { Validator } = require('express-json-validator-middleware');
const validator = new Validator({ allErrors: true });
const validate = validator.validate;



/**
 * Login
 */
router.get("/users/login", login, jwtGenerator, (req, res) => {
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
    res.status(200).send("User was deleted");
});

/**
 * Update user (only admin)
 */
router.put("/users/:userID", jwtExtract, verifyToken, checkIfAdmin, checkUserID, validate({ body: registerSchema }), checkPassword, checkUserToUpdate, getUserInfo, async(req, res) => {
    await User.updateOne({ _id: req.params.userID }, req.userRegistrationInfo);
    res.status(200).send("User information was updated");
});


//Companies CRUD

/**
 * Get companies list 
 */
router.get("/companies", jwtExtract, verifyToken, async(req, res) => {
    const companiesList = await Company.find();
    res.status(200).json(companiesList);
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
    res.status(200).send("Company was deleted");
});

/**
 * Update companies
 */
router.put("/companies/:companyID", jwtExtract, verifyToken, checkCompanyID, validate({ body: companySchema }), checkCompanyToUpdate, async(req, res) => {
    await Company.updateOne({ _id: req.params.companyID }, req.body);
    res.status(200).send("Company information was updated");
});

//Contacts CRUD

/**
 * Get contacts list 
 */
router.get("/contacts", jwtExtract, verifyToken, async(req, res) => {
    const contactsList = await Contact.find();
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
    res.status(200).send("Contact was deleted");
});

/**
 * Update contacts
 */
router.put("/contacts/:contactID", jwtExtract, verifyToken, checkContactID, validate({ body: contactSchema }), checkContactToUpdate, async(req, res) => {
    await Contact.updateOne({ _id: req.params.contactID }, req.body);
    res.status(200).send("Contact information was updated");
});

//City-Country-Regions CRUD

/**
 * Create
 */
router.post("/regions", async(req, res) => {
    const newRegion = new Region(req.body);
    await newRegion.save();
    res.status(201).json(newRegion);
});

router.post("/countries", async(req, res) => {
    const region = await Region.findById(req.body.regionID).exec();
    const newCountry = new Country(req.body);
    await newCountry.save();
    region.countries.push(newCountry);
    await region.save();
    res.status(201).json(newCountry);
    //res.status(201).send(region);
});

router.post("/cities", async(req, res) => {
    const country = await Country.findById(req.body.countryID).exec();
    const newCity = new City(req.body);
    await newCity.save();
    country.cities.push(newCity);
    await country.save();
    res.status(201).json(newCity);
    //res.status(201).send(country);
});

/**
 * Get
 */
router.get("/regions", async(req, res) => {
    const regionsList = await Region.find({}, ['name']).populate({ path: 'countries', select: ['name'], populate: { path: 'cities', select: ['name'] } }).exec();
    // const x = regionsList.map(region => ({
    //     _id: region._id,
    //     name: region.name,
    //     countries: region.countries
    // }));
    res.status(200).json(regionsList);
});

router.get("/countries", async(req, res) => {
    const countriesList = await Country.find({}, ['name']).populate('cities', ['name']).exec();
    res.status(200).json(countriesList);
});

router.get("/cities", async(req, res) => {
    const citiesList = await City.find({}, ['name']);
    res.status(200).json(citiesList);
});

/**
 * Create
 */
router.delete("/regions/:regionID", async(req, res) => {
    await Region.deleteOne({ _id: req.params.regionID })
    res.status(200).send("Region was deleted");
});

router.delete("/countries/:countryID", async(req, res) => {
    await Country.deleteOne({ _id: req.params.countryID })
    res.status(200).send("Country was deleted");
});

router.delete("/cities/:cityID", async(req, res) => {
    await City.deleteOne({ _id: req.params.cityID })
    res.status(200).send("City was deleted");
});

/**
 * Update
 */
router.put("/regions/:regionID", async(req, res) => {
    await Region.updateOne({ _id: req.params.regionID }, req.body);
    res.status(200).send("Region information was updated");
});

router.put("/countries/:countryID", async(req, res) => {
    await Region.updateOne({ _id: req.params.countryID }, req.body);
    res.status(200).send("Country information was updated");
});

router.put("/cities/:cityID", async(req, res) => {
    await Region.updateOne({ _id: req.params.cityID }, req.body);
    res.status(200).send("City information was updated");
});

module.exports = {
    router: router
}